package com.logipro.users.controller.controllers;

import com.logipro.users.controller.dto.RegistrarUsuarioRequestDTO;
import com.logipro.users.controller.dto.UsuarioResponseDTO;
import com.logipro.users.domain.UserStatus;
import com.logipro.users.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.logipro.users.controller.dto.CambiarClaveRequestDTO;
import com.logipro.users.infrastructure.UsuarioRepository;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuarios", description = "Gestión de usuarios (Sprint 1)")
@SecurityRequirement(name = "bearerAuth") // JWT Bearer (solo Swagger)
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;


    @Operation(
            summary = "Registrar usuario",
            description = "Crea un nuevo usuario. Requiere rol ADMIN.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Usuario creado",
                            content = @Content(schema = @Schema(implementation = UsuarioResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Datos inválidos"),
                    @ApiResponse(responseCode = "409", description = "Usuario duplicado")
            }
    )
    @PostMapping("/registrar")
    public ResponseEntity<UsuarioResponseDTO> registrar(@Valid @RequestBody RegistrarUsuarioRequestDTO request) {
        UsuarioResponseDTO creado = usuarioService.registrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @Operation(
            summary = "Listar usuarios",
            description = "Devuelve todos los usuarios.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "OK")
            }
    )
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listar() {
        return ResponseEntity.ok(usuarioService.listar());
    }

    @Operation(
            summary = "Obtener usuario por ID",
            description = "Devuelve un usuario existente por su identificador.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "OK",
                            content = @Content(schema = @Schema(implementation = UsuarioResponseDTO.class))),
                    @ApiResponse(responseCode = "404", description = "No encontrado")
            }
    )
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> obtenerPorId(@PathVariable Long id) {
        return usuarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @Operation(
            summary = "Actualizar usuario",
            description = "Actualiza los datos del usuario usando el DTO de registro.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Usuario actualizado",
                            content = @Content(schema = @Schema(implementation = UsuarioResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Datos inválidos"),
                    @ApiResponse(responseCode = "404", description = "No encontrado")
            }
    )
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody RegistrarUsuarioRequestDTO request
    ) {
        return usuarioService.actualizar(id, request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @Operation(summary = "Cambiar estado de un usuario")
    @PatchMapping("/{id}/estado")
    public ResponseEntity<UsuarioResponseDTO> cambiarEstado(
            @PathVariable Long id,
            @Parameter(description = "Nuevo estado del usuario", required = true,
                    schema = @Schema(implementation = UserStatus.class))
            @RequestParam UserStatus estado) {
        return usuarioService.cambiarEstado(id, estado)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
    @Operation(
            summary = "Cambiar mi clave",
            description = "Permite al usuario autenticado cambiar su propia clave validando la clave actual.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Cambio de clave exitoso"),
                    @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content),
                    @ApiResponse(responseCode = "401", description = "No autenticado", content = @Content)
            }
    )
    @PutMapping("/mi-clave")
    public ResponseEntity<Void> cambiarMiClave(@Valid @RequestBody CambiarClaveRequestDTO request,
                                               Authentication auth) {
        // Validación de confirmación
        if (!request.getNuevaClave().equals(request.getConfirmarClave())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        // Debe estar autenticado
        if (auth == null || !auth.isAuthenticated() || auth.getName() == null || auth.getName().isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // auth.getName() → devuelve el login (en tu caso el campo "usuario")
        String login = auth.getName();

        var usuarioOpt = usuarioRepository.findByUsuario(login);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            var usuario = usuarioOpt.get();
            usuarioService.cambiarMiClave(usuario.getId(), request.getClaveActual(), request.getNuevaClave());
            return ResponseEntity.noContent().build(); // 204
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

}
