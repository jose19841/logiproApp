package com.logipro.orders.infrastructure.rest;

import com.logipro.orders.application.dto.request.ActualizarPedidoRequestDTO;
import com.logipro.orders.application.dto.request.CrearPedidoRequestDTO;
import com.logipro.orders.application.dto.request.FiltroPedidosRequestDTO;
import com.logipro.orders.application.dto.request.RegistrarRecepcionRequestDTO;
import com.logipro.orders.application.dto.response.PedidoResponseDTO;
import com.logipro.orders.application.service.PedidoService;
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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
@Tag(name = "pedidos", description = "Gestion de pedidos de Materiales")
@SecurityRequirement(name = "bearerAuth")
public class PedidoController {

    private final PedidoService pedidoService;

    @Operation(
            summary = "Crear nuevo pedido",
            description = "Crea un pedido con sus ítems y genera el número automáticamente.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Pedido creado",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = PedidoResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content),
                    @ApiResponse(responseCode = "404", description = "Proveedor/Usuario/Material no encontrado", content = @Content)
            }
    )

    @PostMapping
    public ResponseEntity<PedidoResponseDTO> crear(@Valid @RequestBody CrearPedidoRequestDTO request) {
        PedidoResponseDTO response = pedidoService.crear(request);
       return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Actualizar
    @Operation(
            summary = "Actualizar pedido existente",
            description = "Permite actualizar los datos generales o ítems de un pedido existente.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Pedido actualizado correctamente",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = PedidoResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content),
                    @ApiResponse(responseCode = "404", description = "Pedido no encontrado", content = @Content)
            }
    )
    @PutMapping("/{id}")
    public ResponseEntity <PedidoResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarPedidoRequestDTO request) {
        PedidoResponseDTO response = pedidoService.actualizar(id, request);
        return ResponseEntity.ok(response);
    }

    // ==========================================================
    // CAMBIAR ESTADO
    // ==========================================================
    @Operation(
            summary = "Cambiar estado de un pedido",
            description = "Permite cambiar el estado del pedido (PENDIENTE, EN_PROCESO, CANCELADO).",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Estado del pedido actualizado",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = PedidoResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Transición de estado inválida", content = @Content),
                    @ApiResponse(responseCode = "404", description = "Pedido no encontrado", content = @Content)
            }
    )
    @PatchMapping("/{id}/estado")
    public ResponseEntity<PedidoResponseDTO> cambiarEstado(
            @PathVariable Long id,
            @RequestParam String nuevoEstado) {
        PedidoResponseDTO response = pedidoService.cambiarEstado(id, nuevoEstado);
        return ResponseEntity.ok(response);
    }

    // ==========================================================
    // REGISTRAR RECEPCIÓN
    // ==========================================================
    @Operation(
            summary = "Registrar recepción de pedido",
            description = "Marca el pedido como RECIBIDO, registrando la fecha de entrega real y las cantidades recibidas por material.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Recepción registrada exitosamente",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = PedidoResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Datos inválidos o cantidades inconsistentes", content = @Content),
                    @ApiResponse(responseCode = "404", description = "Pedido no encontrado", content = @Content)
            }
    )
    @PostMapping("/recepcion")

    public ResponseEntity<PedidoResponseDTO> registrarRecepcion(
            @Valid @RequestBody RegistrarRecepcionRequestDTO request) {
        PedidoResponseDTO response = pedidoService.registrarRecepcion(request);
        return ResponseEntity.ok(response);
    }

    // ==========================================================
    // ELIMINAR
    // ==========================================================
    @Operation(
            summary = "Eliminar pedido",
            description = "Elimina un pedido si no está en estado RECIBIDO o asociado a otros registros.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Pedido eliminado exitosamente", content = @Content),
                    @ApiResponse(responseCode = "400", description = "No se puede eliminar un pedido finalizado", content = @Content),
                    @ApiResponse(responseCode = "404", description = "Pedido no encontrado", content = @Content)
            }
    )
    @DeleteMapping("/{id}")

    public  ResponseEntity<Void> eliminar (@PathVariable Long id) {
        pedidoService.eliminarPedido(id);
        return ResponseEntity.noContent().build();
    }

    // ==========================================================
    // OBTENER POR ID
    // ==========================================================
    @Operation(
            summary = "Obtener pedido por ID",
            description = "Obtiene la información completa de un pedido por su identificador.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Pedido encontrado",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = PedidoResponseDTO.class))),
                    @ApiResponse(responseCode = "404", description = "Pedido no encontrado", content = @Content)
            }
    )
    @GetMapping("/{id}")

    public  ResponseEntity<PedidoResponseDTO> obtenerPorId(@PathVariable Long id) {
        return pedidoService.obtenerPedidoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ==========================================================
    // LISTAR
    // ==========================================================
    @Operation(
            summary = "Listar pedidos",
            description = "Devuelve un listado de pedidos con filtros opcionales y parámetros de paginación.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Listado obtenido correctamente",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = PedidoResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Filtros inválidos", content = @Content)
            }
    )
    @GetMapping

    public ResponseEntity<List<PedidoResponseDTO>> listar(
            @Valid FiltroPedidosRequestDTO filtros,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        List<PedidoResponseDTO> pedidos = pedidoService.listarPedidos(filtros, page, size, sortBy,sortDir);
        return ResponseEntity.ok(pedidos);
    }

}
