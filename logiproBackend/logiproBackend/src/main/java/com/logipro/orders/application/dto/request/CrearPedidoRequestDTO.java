package com.logipro.orders.application.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CrearPedidoRequestDTO {

    @NotNull(message = "El proveedor es obligatorio")
    private Long proveedorId;

    @Size(max = 500, message = "Las observaciones no pueden superar los 500 caracteres")
    private String observaciones;

    @NotEmpty(message = "El pedido debe contener al menos un item")
    @Valid
    private List<ItemDetalleRequestDTO> detalles;
}
