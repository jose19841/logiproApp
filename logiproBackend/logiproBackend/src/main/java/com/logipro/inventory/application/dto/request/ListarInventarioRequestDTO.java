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
public class ListarInventarioRequestDTO {

    @NotNull
    @Min(0)
    private Integer inicio;

    @NotNull
    @Min(1)
    private Integer limite;

    private Long sectorId;
    private Long materialId;

}
