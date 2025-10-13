package com.logipro.auth.infrastructure.rest;

import com.logipro.auth.application.dto.request.*;
import com.logipro.auth.application.dto.response.*;
import com.logipro.auth.application.service.PasswordResetService;
import com.logipro.config.security.jwt.JwtService;
import com.logipro.config.security.jwt.RefreshTokenService;
import com.logipro.users.domain.model.Usuario;
import com.logipro.users.domain.repository.UsuarioRepository;
import com.logipro.users.application.dto.response.UsuarioResponseDTO;
import com.logipro.users.application.mapper.UsuarioMapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Autenticación y gestión de tokens")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;
    private final PasswordResetService passwordResetService;

    @Operation(
            summary = "Iniciar sesión",
            description = "Autentica a un usuario y devuelve tokens de acceso, refresh y datos del usuario.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Login exitoso",
                            content = @Content(schema = @Schema(implementation = LoginResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Datos inválidos"),
                    @ApiResponse(responseCode = "401", description = "Credenciales incorrectas")
            }
    )
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO req) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getUsuario(), req.getClave())
            );

            String username = auth.getName();

            Usuario usuario = usuarioRepository.findByUsuario(username)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos"));

            // Authorities resueltas por Spring Security (ROLE_*)
            List<String> roles = auth.getAuthorities().stream()
                    .map(a -> {
                        String r = a.getAuthority();
                        return r.startsWith("ROLE_") ? r.substring(5) : r;
                    })
                    .collect(Collectors.toList());

            String accessToken = jwtService.createAccessToken(usuario.getId(), roles);
            String refreshToken = refreshTokenService.createAndStoreRefreshToken(usuario.getId());

            UsuarioResponseDTO userDto = usuarioMapper.toResponse(usuario);

            return ResponseEntity.ok(new LoginResponseDTO(accessToken, refreshToken, userDto));

        } catch (DisabledException e) {
            // Usuario inactivo/suspendido - buscar el estado real
            Usuario usuario = usuarioRepository.findByUsuario(req.getUsuario()).orElse(null);
            String estadoStr = (usuario != null && usuario.getEstado() != null)
                ? usuario.getEstado().name()
                : "INACTIVO";
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                String.format("El usuario '%s' está %s y no puede iniciar sesión", req.getUsuario(), estadoStr)
            );
        } catch (BadCredentialsException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos");
        } catch (UsernameNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos");
        } catch (AuthenticationException e) {
            // Locked, etc.
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos");
        } catch (IllegalArgumentException e) {
            // Mensaje típico del DelegatingPasswordEncoder cuando falta prefijo
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos");
        }
    }

    @Operation(
            summary = "Refrescar tokens",
            description = "Recibe un refresh token válido y devuelve un nuevo par de tokens."
    )
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDTO> refresh(@Valid @RequestBody RefreshRequestDTO req) {
        final RefreshTokenService.RotationResult rotation;
        try {
            rotation = refreshTokenService.rotate(req.getRefreshToken());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long userId = rotation.userId();
        Optional<Usuario> maybeUsuario = usuarioRepository.findById(userId);
        if (maybeUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Usuario usuario = maybeUsuario.get();

        List<String> roles = usuario.getRol() != null && usuario.getRol().getNombre() != null
                ? List.of(usuario.getRol().getNombre())
                : List.of();

        String newAccess = jwtService.createAccessToken(userId, roles);
        UsuarioResponseDTO userDto = usuarioMapper.toResponse(usuario);

        return ResponseEntity.ok(new LoginResponseDTO(newAccess, rotation.newRefreshToken(), userDto));
    }

    @Operation(
            summary = "Cerrar sesión en todos los dispositivos",
            description = "Revoca todos los refresh tokens de un usuario.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @PostMapping("/logout-all")
    public ResponseEntity<Void> logoutAll(@Valid @RequestBody LogoutRequestDTO req) {
        JwtService.RefreshClaims claims = jwtService.parseRefresh(req.getRefreshToken());
        long userId = claims.sub();
        refreshTokenService.revokeAllForUser(userId);
        return ResponseEntity.noContent().build();
    }
    // ===================== RECUPERACIÓN DE CONTRASEÑA =====================

    @Operation(
            summary = "Solicitud de recuperación (usuario o email)",
            description = "Inicia el flujo de recuperación de contraseña aceptando un identificador que puede ser nombre de usuario o email."
    )
    @PostMapping("/forgot")
    public ResponseEntity<ApiMessageDTO> forgot(@Valid @RequestBody ForgotPasswordRequestDTO req,
                                                @RequestHeader(value = "X-Forwarded-For", required = false) String xff,
                                                @RequestHeader(value = "User-Agent", required = false) String ua,
                                                @RequestHeader(value = "X-Real-IP", required = false) String xRealIp) {

        String ip = firstNonEmpty(xff, xRealIp, "0.0.0.0");
        String userAgent = (ua == null || ua.isBlank()) ? "unknown" : ua;

        passwordResetService.solicitarReset(req.getIdentifier(), ip, userAgent);

        // Siempre el mismo 200 para no filtrar existencia de cuentas
        return ResponseEntity.ok(new ApiMessageDTO(
                "Si existe una cuenta asociada, se envió un correo con instrucciones."
        ));
    }

    @Operation(
            summary = "Confirmar recuperación",
            description = "Confirma el cambio de contraseña con el token enviado por email."
    )
    @PostMapping("/reset")
    public ResponseEntity<?> reset(@Valid @RequestBody ResetPasswordRequestDTO req) {
        try {
            passwordResetService.confirmarReset(req.getToken(), req.getNuevaClave());
            return ResponseEntity.noContent().build(); // 204
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(new ApiMessageDTO("Token inválido o expirado"));
        }
    }

    private static String firstNonEmpty(String... values) {
        if (values == null) return null;
        for (String v : values) {
            if (v != null && !v.isBlank()) return v;
        }
        return null;
    }
}