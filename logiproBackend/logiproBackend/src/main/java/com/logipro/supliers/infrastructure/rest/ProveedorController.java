package com.logipro.supliers.infrastructure.rest;

import com.logipro.supliers.application.dto.request.ActualizarProveedorRequestDTO;
import com.logipro.supliers.application.dto.request.CrearProveedorRequestDTO;
import com.logipro.supliers.application.dto.response.ProveedorResponseDTO;
import com.logipro.supliers.application.service.ProveedorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
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

import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
@RequiredArgsConstructor
@Tag(name = "Proveedores", description = "Gestión de proveedores del sistema")
@SecurityRequirement(name = "bearerAuth")
public class ProveedorController {


    private final ProveedorService proveedorService;

    /**
     * ================================================================
     * ENDPOINT: Crear nuevo proveedor
     * ---------------------------------------------------------------
     * Método POST que permite registrar un proveedor en el sistema.
     * Requiere autenticación por token Bearer (JWT).
     * ================================================================
     *
     * @param request DTO con los datos del proveedor a crear.
     * @return ProveedorResponseDTO con el proveedor creado.
     */
    @PostMapping
    @Operation(
            summary = "Crear nuevo proveedor",
            description = "Registra un proveedor en el sistema. Se requiere token JWT válido.",
            responses = {
                    @ApiResponse(
                            responseCode = "201",
                            description = "Proveedor creado exitosamente",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ProveedorResponseDTO.class))
                    ),
                    @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content),
                    @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content)
            }
    )
    public ResponseEntity<ProveedorResponseDTO> crear(
            @Valid @RequestBody CrearProveedorRequestDTO request) {

        ProveedorResponseDTO response = proveedorService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ---------- GET: Listar ----------
    @GetMapping
    @Operation(
            summary = "Listar proveedores",
            description = "Devuelve todos los proveedores ordenados por nombre (ASC).",
            responses = {
                    @ApiResponse(responseCode = "200", description = "OK",
                            content = @Content(mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = ProveedorResponseDTO.class)))),
                    @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content)
            }
    )
    public ResponseEntity<List<ProveedorResponseDTO>> listar() {
        List<ProveedorResponseDTO> lista = proveedorService.listar();
        return ResponseEntity.ok(lista);
    }

    // ---------- GET: Buscar por ID ----------
    @GetMapping("/{id}")
    @Operation(
            summary = "Obtener proveedor por ID",
            description = "Retorna el proveedor solicitado por su identificador.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "OK",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ProveedorResponseDTO.class))),
                    @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
                    @ApiResponse(responseCode = "404", description = "No encontrado", content = @Content)
            }
    )
    public ResponseEntity<ProveedorResponseDTO> obtenerPorId(@PathVariable Long id) {
        return proveedorService.buscar(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PatchMapping("/{id}")
    @Operation(
            summary = "Actualizar proveedor (parcial)",
            description = "Edita nombre y/o descripción del proveedor. Requiere JWT.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Proveedor actualizado",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ProveedorResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content),
                    @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
                    @ApiResponse(responseCode = "404", description = "No encontrado", content = @Content)
            }
    )
    public ResponseEntity<ProveedorResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarProveedorRequestDTO request) {
        return proveedorService.actualizar(id, request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
