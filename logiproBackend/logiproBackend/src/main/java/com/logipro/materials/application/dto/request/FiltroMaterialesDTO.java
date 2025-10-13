package com.logipro.materials.application.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FiltroMaterialesDTO {
    private Long proveedorId;
    private Long reclamoId;
    private Long tipoMaterialId;
    private Integer minCantidad;
    private Integer maxCantidad;
}
