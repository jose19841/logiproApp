package com.logipro.orders.application.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrarRecepcionRequestDTO {

    @NotNull(message = "El identificacdor del pedido es obligatorio")
    private Long pedidoId;

    @NotNull(message = "La fecha de entrega es obligtoria")
    private LocalDate fechaEntregaReal;

    @Valid
    @NotNull(message = "debe incluir los detalles con las cantidades recibidas")
    private List<DetalleRecepcionRequestDTO> detalles;
}
