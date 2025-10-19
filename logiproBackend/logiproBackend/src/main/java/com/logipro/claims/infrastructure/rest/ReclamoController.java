package com.logipro.claims.infrastructure.rest;

import com.logipro.claims.application.dto.request.CambiarEstadoReclamoRequestDTO;
import com.logipro.claims.application.dto.request.CrearReclamoRequestDTO;
import com.logipro.claims.application.dto.response.ReclamoResponseDTO;
import com.logipro.claims.application.service.ReclamoService;
import com.logipro.claims.domain.model.EstadoReclamo;

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
@RequestMapping("/api/reclamos")
@RequiredArgsConstructor
@Tag(name = "Reclamos", description = "Gestión de reclamos")
@SecurityRequirement(name = "bearerAuth")
public class ReclamoController {

    private final ReclamoService reclamoService;

    @PostMapping
    @Operation(
            summary = "Crear nuevo reclamo",
            description = "Registra un reclamo asociado a un proveedor. Requiere JWT.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Reclamo creado",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ReclamoResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content),
                    @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
                    @ApiResponse(responseCode = "404", description = "Proveedor no encontrado", content = @Content)
            }
    )
    public ResponseEntity<ReclamoResponseDTO> crear(@Valid @RequestBody CrearReclamoRequestDTO request) {
            ReclamoResponseDTO response = reclamoService.crear(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(
            summary = "Listar reclamos",
            description = "Devuelve todos los reclamos ordenados por número de reclamo (ASC).",
            responses = {
                    @ApiResponse(responseCode = "200", description = "OK",
                            content = @Content(mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = ReclamoResponseDTO.class)))),
                    @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content)
            }
    )
    public ResponseEntity<List<ReclamoResponseDTO>> listar() {
        return ResponseEntity.ok(reclamoService.listar());
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtener reclamo por ID",
            description = "Retorna el reclamo solicitado por su identificador.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "OK",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ReclamoResponseDTO.class))),
                    @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
                    @ApiResponse(responseCode = "404", description = "No encontrado", content = @Content)
            }
    )
    public ResponseEntity<ReclamoResponseDTO> obtenerPorId(@PathVariable Long id) {
        return reclamoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PatchMapping("/{id}/estado")
    @Operation(
            summary = "Cambiar estado del reclamo",
            description = "Actualiza el estado del reclamo (PENDIENTE, EN_PROCESO, RESUELTO, CERRADO). Requiere JWT.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Estado actualizado",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ReclamoResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Estado inválido o datos incorrectos", content = @Content),
                    @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
                    @ApiResponse(responseCode = "404", description = "Reclamo no encontrado", content = @Content)
            }
    )
    public ResponseEntity<ReclamoResponseDTO> cambiarEstado(
            @PathVariable Long id,
            @Valid @RequestBody CambiarEstadoReclamoRequestDTO request) {

        return reclamoService.cambiarEstado(id, request)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/estado/{estado}")
    @Operation(
            summary = "Listar reclamos por estado",
            description = "Devuelve los reclamos filtrados por estado (PENDIENTE, EN_PROCESO, RESUELTO, CERRADO).",
            responses = {
                    @ApiResponse(responseCode = "200", description = "OK",
                            content = @Content(mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = ReclamoResponseDTO.class)))),
                    @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
                    @ApiResponse(responseCode = "400", description = "Estado inválido", content = @Content)
            }
    )
    public ResponseEntity<List<ReclamoResponseDTO>> listarPorEstado(@PathVariable String estado) {
        try {
            EstadoReclamo e = EstadoReclamo.valueOf(estado.trim().toUpperCase());
            return ResponseEntity.ok(reclamoService.listarPorEstado(e));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
