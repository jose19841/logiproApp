package com.logipro.inventory.infrastructure.rest;

import com.logipro.inventory.application.dto.request.ActualizarInventarioRequestDTO;
import com.logipro.inventory.application.dto.request.CrearInventarioRequestDTO;
import com.logipro.inventory.application.dto.request.ListarInventarioRequestDTO;
import com.logipro.inventory.application.dto.response.InventarioResponseDTO;
import com.logipro.inventory.application.mapper.InventarioMapper;
import com.logipro.inventory.application.service.InventarioService;
import com.logipro.inventory.domain.model.Inventario;
import com.logipro.inventory.domain.model.Sector;
import com.logipro.inventory.domain.repository.InventarioRepository;
import com.logipro.inventory.domain.repository.SectorRepository;
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
@RequestMapping("/api/inventario")
@RequiredArgsConstructor
@Tag(name = "inventario", description = "Gestion de inventario (sectores y materiales en stock minimo/maximo")
@SecurityRequirement(name="bearerAuth")
public class InventarioController {

    private final InventarioService inventarioService;
    private final InventarioMapper inventarioMapper;
    private final SectorRepository sectorRepository;

    @PostMapping
    @Operation (
            summary = "Crear registro de inventario",
            description = "Crea un registro de inventario para un material en un sector. Requiere JWT.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Inventario creado",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = InventarioResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content),
                    @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
                    @ApiResponse(responseCode = "404", description = "Sector o material no encontrado", content = @Content)
            }
    )
    public ResponseEntity<InventarioResponseDTO> crear (@Valid @RequestBody CrearInventarioRequestDTO request) {
        Inventario creado = inventarioService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(inventarioMapper.toResponseDTO(creado));
    }
    @GetMapping
    @Operation(
            summary = "Listar inventario (con límite/inicio y filtros opcionales)",
            description = "Devuelve inventario ordenado por ID. Filtros opcionales por sectorId y/o materialId.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "OK",
                            content = @Content(mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = InventarioResponseDTO.class)))),
                    @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content)
            }
    )
    public ResponseEntity<List<InventarioResponseDTO>> listar (
            @RequestParam(defaultValue = "0") Integer inicio,
            @RequestParam(defaultValue = "20") Integer limite,
            @RequestParam(required = false) Long sectorId,
            @RequestParam(required = false) Long materialId

    ) {
        ListarInventarioRequestDTO dto = new ListarInventarioRequestDTO(inicio, limite, sectorId, materialId);
        return ResponseEntity.ok(inventarioService.listar(dto));
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Obtener inventario por ID",
            description = "Retorna un registro de inventario por su identificador.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "OK",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = InventarioResponseDTO.class))),
                    @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
                    @ApiResponse(responseCode = "404", description = "No encontrado", content = @Content)
            }
    )
    public ResponseEntity<InventarioResponseDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(inventarioService.obtener(id));
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Actualizar inventario",
            description = "Actualiza cantidades mín./máx. y/o reasigna sector/material. Requiere JWT.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Inventario actualizado",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = InventarioResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content),
                    @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
                    @ApiResponse(responseCode = "404", description = "Inventario/sector/material no encontrado", content = @Content)
            }
    )
    public ResponseEntity<InventarioResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarInventarioRequestDTO body
            ) {
        // si el body no trae id, lo seteo desde la ruta
        if(body.getInventarioId() ==null) {
            body.setInventarioId(id);
        }
        return ResponseEntity.ok(inventarioService.actualizar(body));
    }
    @DeleteMapping("/{id}")
    @Operation(
            summary = "Eliminar inventario",
            description = "Elimina un registro de inventario por su ID. Requiere JWT.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Eliminado", content = @Content),
                    @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content),
                    @ApiResponse(responseCode = "404", description = "No encontrado", content = @Content)
            }
    )
    public ResponseEntity<Void> eliminar (@PathVariable Long id) {
        inventarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/sectores")
    @Operation(
            summary = "Listar sectores",
            description = "Devuelve la lista completa de sectores disponibles. Requiere JWT.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "OK",
                            content = @Content(mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = Sector.class)))),
                    @ApiResponse(responseCode = "401", description = "No autorizado", content = @Content)
            }
    )
    public ResponseEntity<List<Sector>> listarSectores() {
        return ResponseEntity.ok(sectorRepository.findAll());
    }
}
