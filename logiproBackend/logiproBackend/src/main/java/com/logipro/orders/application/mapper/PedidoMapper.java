
package com.logipro.orders.application.mapper;

import com.logipro.orders.application.dto.response.DetallePedidoResponseDTO;
import com.logipro.orders.application.dto.response.PedidoResponseDTO;
import com.logipro.orders.domain.model.DetallePedido;
import com.logipro.orders.domain.model.Pedido;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;

@Component
public class PedidoMapper {

    public PedidoResponseDTO toResponseDTO(Pedido pedido) {
        if (pedido == null) return null;

        return PedidoResponseDTO.builder()
                .id(pedido.getId())
                .numeroPedido(pedido.getNumeroPedido())

                // Proveedor
                .proveedorId(pedido.getProveedor() != null ? pedido.getProveedor().getId() : null)
                .proveedorNombre(pedido.getProveedor() != null ? pedido.getProveedor().getNombre() : null)

                // Fechas
                .fechaPedido(pedido.getFechaPedido())
                .fechaEntregaEstimada(pedido.getFechaEntregaEstimada())
                .fechaEntregaReal(pedido.getFechaEntregaReal())

                // Estado
                .estado(pedido.getEstado() != null ? pedido.getEstado().name() : null)

                // Totales y observaciones
                .montoTotal(pedido.getMontoTotal())
                .observaciones(pedido.getObservaciones())

                // Usuario creador
                .usuarioId(pedido.getUsuarioCreador() != null ? pedido.getUsuarioCreador().getId() : null)
                .usuarioNombre(pedido.getUsuarioCreador() != null ? pedido.getUsuarioCreador().getNombre() : null)

                // Detalles
                .detalles(mapDetalles(pedido.getDetalles()))
                .build();
    }

    private List<DetallePedidoResponseDTO> mapDetalles(List<DetallePedido> detalles) {
        if (detalles == null) return List.of();
        return detalles.stream()
                .filter(Objects::nonNull)
                .map(d -> DetallePedidoResponseDTO.builder()
                        .id(d.getId())
                        .materialId(d.getMaterial() != null ? d.getMaterial().getId() : null)
                        .materialNombre(
                                (d.getMaterial() != null && d.getMaterial().getTipoMaterial() != null)
                                        ? d.getMaterial().getTipoMaterial().getNombre()
                                        : null
                        )
                        .cantidadSolicitada(d.getCantidadSolicitada())
                        .cantidadRecibida(d.getCantidadRecibida())
                        .precioUnitario(d.getPrecioUnitario())
                        .subtotal(d.getSubtotal())
                        .build())
                .toList();
    }
}
