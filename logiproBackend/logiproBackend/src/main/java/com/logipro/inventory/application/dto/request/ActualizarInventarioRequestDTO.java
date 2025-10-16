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

    @NotNull
    private Long inventarioId;

    @Min(0)
    private Integer cantidadMinima;

    @Min(0)
    private  Integer cantidadMaxima;

    private Long sectorId;
    private Long materialId;
}
