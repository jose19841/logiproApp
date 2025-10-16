package com.logipro.inventory.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InventarioResponseDTO {

    private Long id;
    private Integer cantidadMinima;
    private Integer cantidadMaxima;
    private Long sectorId;
    private String sectorNombre;
    private Long materialId;
    private String materialNombre;
}
