package com.logipro.orders.application.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemDetalleRequestDTO {

    @NotNull(message = "El material es obligatorio")
    private Long materialId;

    @NotNull(message = "la cantidad solicitada es obligatoria")
    @Positive(message = "la cantidad solicitada debe ser mayor a 0")
    private Integer cantidadSolicitada;

    @NotNull(message = "el precio unitario es obligatorio")
    @DecimalMin(value = "0.00", inclusive = true, message = "el precio unitario no puede ser negativo")
    private BigDecimal precioUnitario;
}
