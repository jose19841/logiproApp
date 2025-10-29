package com.logipro.orders.application.dto.request;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FiltroPedidosRequestDTO {

    /** Filtrar por proveedor */
    private Long proveedorId;

    /** Filtrar por estado textual: PENDIENTE | EN_PROCESO | RECIBIDO | CANCELADO  */
    private String estado;

    /** Rango de fechas del pedido */
    private LocalDate fechaDesde;
    private LocalDate fechaHasta;

    /** Filtrar por material involucrado en algún detalle  */
    private Long materialId;

    /** Búsqueda por número exacto */
    private String numeroPedido;

    /** Filtrar por usuario creador (opcional) */
    private Long usuarioId;
}
