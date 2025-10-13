package com.logipro.claims.application.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ReclamoResponseDTO {
    private Long id;
    private String numReclamo;
    private String descripcion;
    private String estado;
    private Long detalleReclamoId;

    // Datos delproveedor asociado
    private Long proveedorId;
    private String proveedorNombre;
    private String proveedorDescripcion;
}
