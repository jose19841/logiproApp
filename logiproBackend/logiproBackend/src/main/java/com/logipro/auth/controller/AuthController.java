package com.logipro.auth.controller;

import com.logipro.auth.dto.LoginRequestDTO;
import com.logipro.auth.dto.LoginResponseDTO;
import com.logipro.auth.dto.RefreshRequestDTO;
import com.logipro.auth.dto.LogoutRequestDTO;
import com.logipro.config.security.jwt.JwtService;
import com.logipro.config.security.jwt.RefreshTokenService;
import com.logipro.users.domain.Usuario;
import com.logipro.users.domain.UserStatus;
import com.logipro.users.infrastructure.UsuarioRepository;

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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Autenticación y gestión de tokens")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final UsuarioRepository usuarioRepository;

    @Operation(
            summary = "Iniciar sesión",
            description = "Autentica a un usuario y devuelve tokens de acceso y refresh.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Login exitoso",
                            content = @Content(schema = @Schema(implementation = LoginResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Datos inválidos"),
                    @ApiResponse(responseCode = "401", description = "Credenciales incorrectas o usuario no autorizado")
            }
    )
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO req) {
        try {
            // 1) Autenticación con Spring Security
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
            );

            // 2) Username autenticado
            String username = ((UserDetails) auth.getPrincipal()).getUsername();

            // 3) Usuario real en BD
            Usuario usuario = usuarioRepository.findByUsuario(username)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos"));

            // 4) Regla de negocio: sólo ACTIVO puede iniciar sesión
            if (usuario.getEstado() != UserStatus.ACTIVO) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario inactivo o no autorizado");
            }

            // 5) Rol real (evita NPE si falta rol)
            String rolNombre = (usuario.getRol() != null ? usuario.getRol().getNombre() : null);
            if (rolNombre == null || rolNombre.isBlank()) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Usuario sin rol asignado");
            }

            Long userId = usuario.getId();
            List<String> roles = List.of(rolNombre);

            // 6) Emitir tokens
            String accessToken  = jwtService.createAccessToken(userId, roles);
            String refreshToken = refreshTokenService.createAndStoreRefreshToken(userId);

            return ResponseEntity.ok(new LoginResponseDTO(accessToken, refreshToken));

        } catch (BadCredentialsException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos");
        } catch (ResponseStatusException e) {
            // ya viene con el status correcto
            throw e;
        } catch (Exception e) {
            // cualquier otra cosa no prevista -> 500 controlado
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno al iniciar sesión");
        }
    }

    @Operation(
            summary = "Refrescar tokens",
            description = "Recibe un refresh token válido y devuelve un nuevo par de tokens.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Tokens renovados",
                            content = @Content(schema = @Schema(implementation = LoginResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Refresh token malformado o inválido"),
                    @ApiResponse(responseCode = "401", description = "Refresh token revocado/expirado o usuario no autorizado")
            }
    )
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDTO> refresh(@Valid @RequestBody RefreshRequestDTO req) {
        // 1) Intentar rotar/validar el refresh. Si falla, devolver 401/400 SIN lanzar excepción.
        final RefreshTokenService.RotationResult rotation;
        try {
            rotation = refreshTokenService.rotate(req.getRefreshToken());
        } catch (IllegalArgumentException e) {
            // token malformado/firma inválida
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (RuntimeException e) {
            // revocado / expirado / no existe en store
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            // fallback defensivo
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 2) Cargar usuario por ID y validar estado/rol (sin excepciones)
        Long userId = rotation.userId();
        var maybeUsuario = usuarioRepository.findById(userId);
        if (maybeUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        var usuario = maybeUsuario.get();
        if (usuario.getEstado() != com.logipro.users.domain.UserStatus.ACTIVO) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (usuario.getRol() == null || usuario.getRol().getNombre() == null || usuario.getRol().getNombre().isBlank()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // 3) Emitir access nuevo y devolver refresh rotado
        var roles = java.util.List.of(usuario.getRol().getNombre());
        String newAccess = jwtService.createAccessToken(userId, roles);
        return ResponseEntity.ok(new LoginResponseDTO(newAccess, rotation.newRefreshToken()));
    }


    @Operation(
            summary = "Cerrar sesión en todos los dispositivos",
            description = "Revoca todos los refresh tokens de un usuario.",
            security = @SecurityRequirement(name = "bearerAuth"),
            responses = {
                    @ApiResponse(responseCode = "204", description = "Sesiones revocadas"),
                    @ApiResponse(responseCode = "400", description = "Token inválido"),
                    @ApiResponse(responseCode = "401", description = "No autorizado")
            }
    )
    @PostMapping("/logout-all")
    public ResponseEntity<Void> logoutAll(@Valid @RequestBody LogoutRequestDTO req) {
        JwtService.RefreshClaims claims = jwtService.parseRefresh(req.getRefreshToken());
        long userId = claims.sub();
        refreshTokenService.revokeAllForUser(userId);
        return ResponseEntity.noContent().build();
    }
}
