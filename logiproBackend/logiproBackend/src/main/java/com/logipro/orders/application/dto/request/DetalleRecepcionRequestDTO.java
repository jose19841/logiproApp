package com.logipro.orders.application.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetalleRecepcionRequestDTO {

    @NotNull(message = "El identificador del material es obligatorio")
    private Long materialId;

    @NotNull(message = "Debe especificar la cantidad recibida")
    @PositiveOrZero(message = "La cantidad recibida no puede ser negativa")
    private Integer cantidadRecibida;
}
