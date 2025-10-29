package com.logipro.orders.application.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotEmpty;
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

public class CrearPedidoRequestDTO {

    @NotNull(message = "El proveedor es obligatorio")
    private Long proveedorId;

    @NotNull(message = "la fecha de pedido es obligatoria")
    private LocalDate fechaPedido;

    @FutureOrPresent(message = "la fecha estimada de entrega debe ser hoy o futura")
    private LocalDate fechaEntregaEstimada;

    @Size(max = 500, message = "las observaciones no pueden superar los 500 caracteres")
    private String observaciones;

    @NotNull(message = "El usuario creador es obligatorio")
    private Long usuarioId;

    @NotEmpty(message = "El pedido debe contener al menos un item")
    @Valid
    private List<ItemDetalleRequestDTO> detalles;


}
