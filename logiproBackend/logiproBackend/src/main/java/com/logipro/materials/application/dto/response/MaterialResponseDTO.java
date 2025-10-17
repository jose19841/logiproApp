package com.logipro.materials.application.dto.response;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaterialResponseDTO {

    private Long id;
    private Integer cantidad;
    private Instant fechaCreacion;

    // Datos de relaciones (simplificados)
    private Long reclamoId;
    private String reclamoDescripcion;

    private Long proveedorId;
    private String proveedorDescripcion;

    private Long calidadId;
    private String resultadoCalidad;  // Alias para compatibilidad con tabla
    private String resultadoInspeccion;  // Para el formulario de edición
    private String observacionesInspeccion;  // Para el formulario de edición

    private Long tipoMaterialId;
    private String nombreTipoMaterial;
}
