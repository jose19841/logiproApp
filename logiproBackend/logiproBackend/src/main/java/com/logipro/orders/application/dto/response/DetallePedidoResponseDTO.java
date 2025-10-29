package com.logipro.orders.application.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class DetallePedidoResponseDTO {

    private Long id;
    private Long materialId;
    private String materialNombre;
    private Integer cantidadSolicitada;
    private Integer cantidadRecibida;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
}
