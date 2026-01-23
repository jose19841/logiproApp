package com.logipro.orders.application.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActualizarPedidoRequestDTO {

    private LocalDate fechaPedido;

    @FutureOrPresent(message = "La fecha de entrega estimada debe ser hoy a futura")
    private LocalDate fechaEntregaEstimada;
    @Size(max = 500, message = "Las observaciones no deben superar los 500 caracteres")
    private String observaciones;

    @Valid
    private List<ItemDetalleRequestDTO> detalles;
}
