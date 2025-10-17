package com.logipro.materials.infrastructure.rest;

import com.logipro.materials.application.dto.request.ActualizarMaterialRequestDTO;
import com.logipro.materials.application.dto.request.CrearMaterialRequestDTO;
import com.logipro.materials.application.dto.request.FiltroMaterialesDTO;
import com.logipro.materials.application.dto.response.MaterialResponseDTO;
import com.logipro.materials.application.service.MaterialService;
import com.logipro.materials.domain.model.TipoMaterial;
import com.logipro.materials.domain.repository.TipoMaterialRepository;

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
@RequestMapping("/api/materiales")
@RequiredArgsConstructor
@Tag(name = "Materiales", description = "Gestión")
@SecurityRequirement(name = "bearerAuth")
public class MaterialController {

    private final MaterialService materialService;
    private final TipoMaterialRepository tipoMaterialRepository;

    @Operation(
            summary = "Crear material",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Material creado",
                            content = @Content(schema = @Schema(implementation = MaterialResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content),
                    @ApiResponse(responseCode = "404", description = "Referencia inexistente", content = @Content)
            }
    )
    @PostMapping
    public ResponseEntity<MaterialResponseDTO> crear(@Valid @RequestBody CrearMaterialRequestDTO request) {
        MaterialResponseDTO response = materialService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(
            summary = "Listar materiales (filtros + paginado + orden)",
            description = "Filtros: proveedorId, reclamoId, tipoMaterialId, cantidadMin, cantidadMax. " +
                    "Paginado: page (0..N), size (>=1). Orden: sortBy (propiedad), sortDir (asc|desc).",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Listado de materiales",
                            content = @Content(array = @ArraySchema(schema = @Schema(implementation = MaterialResponseDTO.class))))
            }
    )
    @GetMapping
    public ResponseEntity<List<MaterialResponseDTO>> listar(
            @RequestParam(required = false) Long proveedorId,
            @RequestParam(required = false) Long reclamoId,
            @RequestParam(required = false) Long tipoMaterialId,
            @RequestParam(required = false) Integer cantidadMin,
            @RequestParam(required = false) Integer cantidadMax,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        FiltroMaterialesDTO filtro = new FiltroMaterialesDTO(
                proveedorId, reclamoId, tipoMaterialId, cantidadMin, cantidadMax
        );
        List<MaterialResponseDTO> lista = materialService.listar(filtro, page, size, sortBy, sortDir);
        return ResponseEntity.ok(lista);
    }

    @Operation(
            summary = "Obtener material por ID",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Material encontrado",
                            content = @Content(schema = @Schema(implementation = MaterialResponseDTO.class))),
                    @ApiResponse(responseCode = "404", description = "Material no encontrado", content = @Content)
            }
    )
    @GetMapping("/{id}")
    public ResponseEntity<MaterialResponseDTO> obtenerPorId(@PathVariable Long id) {
        MaterialResponseDTO dto = materialService.buscarPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Material no encontrado: id=" + id));
        return ResponseEntity.ok(dto);
    }

    @Operation(
            summary = "Actualizar material",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Material actualizado",
                            content = @Content(schema = @Schema(implementation = MaterialResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content),
                    @ApiResponse(responseCode = "404", description = "Material o referencia no encontrada", content = @Content)
            }
    )
    @PutMapping("/{id}")
    public ResponseEntity<MaterialResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarMaterialRequestDTO request
    ) {
        MaterialResponseDTO dto = materialService.actualizar(id, request);
        return ResponseEntity.ok(dto);
    }

    @Operation(
            summary = "Eliminar material",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Material eliminado"),
                    @ApiResponse(responseCode = "404", description = "Material no encontrado", content = @Content)
            }
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        materialService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Listar todos los tipos de material",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Listado de tipos de material",
                            content = @Content(array = @ArraySchema(schema = @Schema(implementation = TipoMaterial.class))))
            }
    )
    @GetMapping("/tipos-material")
    public ResponseEntity<List<TipoMaterial>> listarTiposMaterial() {
        List<TipoMaterial> tipos = tipoMaterialRepository.findAll();
        return ResponseEntity.ok(tipos);
    }
}
