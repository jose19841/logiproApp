package com.logipro.inventory.application.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarInventarioRequestDTO {

    // El inventarioId se obtiene del path parameter, no es obligatorio en el body
    private Long inventarioId;

    @NotNull(message = "La cantidad mínima es obligatoria")
    @Min(value = 0, message = "La cantidad mínima debe ser mayor o igual a 0")
    private Integer cantidadMinima;

    @NotNull(message = "La cantidad máxima es obligatoria")
    @Min(value = 0, message = "La cantidad máxima debe ser mayor o igual a 0")
    private Integer cantidadMaxima;

    @NotNull(message = "El sector es obligatorio")
    private Long sectorId;

    @NotNull(message = "El material es obligatorio")
    private Long materialId;
}
