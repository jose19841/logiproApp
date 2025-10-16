package com.logipro.inventory.application.dto.request;

import jakarta.annotation.security.DenyAll;
import jakarta.validation.constraints.Max;
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
public class CrearInventarioRequestDTO {

    @NotNull
    private Long sectorId;

    @NotNull
    private Long materialId;

    @NotNull
    @Min(0)
    private Integer cantidadMinima;

    @NotNull
    @Min(0)
    private Integer cantidadMaxima;
}
