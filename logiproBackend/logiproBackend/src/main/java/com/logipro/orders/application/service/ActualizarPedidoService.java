package com.logipro.orders.application.service;

import com.logipro.materials.domain.model.Material;
import com.logipro.materials.domain.repository.MaterialRepository;
import com.logipro.orders.application.dto.request.ActualizarPedidoRequestDTO;
import com.logipro.orders.application.dto.request.ItemDetalleRequestDTO;
import com.logipro.orders.application.dto.response.PedidoResponseDTO;
import com.logipro.orders.application.mapper.PedidoMapper;
import com.logipro.orders.application.usecase.ActualizarPedidoUseCase;
import com.logipro.orders.domain.model.DetallePedido;
import com.logipro.orders.domain.model.EstadoPedido;
import com.logipro.orders.domain.model.Pedido;
import com.logipro.orders.domain.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional
@RequiredArgsConstructor
public class ActualizarPedidoService implements ActualizarPedidoUseCase {
    private final PedidoRepository pedidoRepository;
    private final MaterialRepository materialRepository;
    private final PedidoMapper pedidoMapper;


    @Override
    public PedidoResponseDTO ejecutar(Long id, ActualizarPedidoRequestDTO request) {

        // 1) Buscar Pedido
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("Pedido no encontrado: id" + id));

        // 2) Reglas: no actualizar si está cancelado; si está recibido, no tocar ítems
        if (pedido.getEstado() == EstadoPedido.CANCELADO) {
            throw new IllegalStateException("NO se puede actualziar un pedido cancelado");
        }
        if (pedido.getEstado() == EstadoPedido.RECIBIDO && request.getDetalles() != null && !request.getDetalles().isEmpty()) {
            throw new IllegalStateException("Nos e pueden modificar items de un pedido ya recibido");
        }

        // 3) Actualizar datos básicos
        if(request.getFechaPedido() !=null) {
            pedido.setFechaPedido(request.getFechaPedido());
        }
        if(request.getFechaEntregaEstimada() !=null) {
            pedido.setFechaEntregaEstimada(request.getFechaEntregaEstimada());
        }
        pedido.setObservaciones(request.getObservaciones());

        // 4) Si vienen detalles, se reemplaza el conjunto completo
        if( request.getDetalles() != null) {
            pedido.getDetalles().clear();

            for (ItemDetalleRequestDTO item : request.getDetalles()) {
                validarItem(item);

                Material material = materialRepository.findById(item.getMaterialId())
                        .orElseThrow(() -> new IllegalArgumentException("Material no encontrado: id" + item.getMaterialId()));

                DetallePedido detalle = DetallePedido.builder()
                        .pedido(pedido)
                        .material(material)
                        .cantidadSolicitada(item.getCantidadSolicitada())
                        .cantidadRecibida(null) // actualziacion no registra recepcion
                        .precioUnitario(item.getPrecioUnitario())
                        .subtotal(BigDecimal.ZERO)
                        .build();

                pedido.agregarDetalle(detalle);
            }
        }

        // 5) recalcular y persistir
        pedido.recalcularTotales();
        Pedido guardado = pedidoRepository.save(pedido);

        // 6) respuesta
        return pedidoMapper.toResponseDTO(guardado);
    }

    /* ===================== Helpers ===================== */
    private void validarItem(ItemDetalleRequestDTO item) {
        if (item.getCantidadSolicitada() == null || item.getCantidadSolicitada() <=0) {
            throw new IllegalArgumentException("La cantidad solicitada debe ser mayor a 0 (materialId=" + item.getMaterialId() + ")");
        }
        if (item.getPrecioUnitario() == null || item.getPrecioUnitario().signum() < 0) {
            throw new IllegalArgumentException("El precio unitario no puede ser negativo (materialId=" + item.getMaterialId() + ")" );
        }
    }
}
