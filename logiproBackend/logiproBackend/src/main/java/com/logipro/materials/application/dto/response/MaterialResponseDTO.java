package com.logipro.materials.application.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialResponseDTO {

    private Long id;
    private Integer cantidad;

    // Datos de relaciones (simplificados)
    private Long recladoId;
    private String reclamoDescripcion;

    private Long proveedorId;
    private String proveedorDescripcion;

    private Long calidadId;
    private String resultadoCalidad;

    private Long tipoMaterialId;
    private String nombreTipoMaterial;
}
