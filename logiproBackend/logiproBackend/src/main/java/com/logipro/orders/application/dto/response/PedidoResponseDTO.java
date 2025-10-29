package com.logipro.orders.application.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoResponseDTO {

    private Long id;
    private String numeroPedido;

    private Long proveedorId;
    private String proveedorNombre;

    // fechas
    private LocalDate fechaPedido;
    private LocalDate fechaEntregaEstimada;
    private LocalDate fechaEntregaReal;

    // Estado textual (ej: PENDIENTE, EN_PROCESO, RECIBIDO, CANCELADO)
    private String estado;

    private BigDecimal montoTotal;
    private String observaciones;

    // usuario creador
    private Long usuarioId;
    private String usuarioNombre;

    private List<DetallePedidoResponseDTO> detalles;
}
