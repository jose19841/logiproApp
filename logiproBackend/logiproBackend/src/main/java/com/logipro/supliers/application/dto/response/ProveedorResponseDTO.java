package com.logipro.supliers.application.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * ========== RESPONSE DTO: Proveedor ==========
 * Representa los datos expuestos al cliente tras crear o consultar un proveedor.
 */
@Getter
@Setter
@Builder
public class ProveedorResponseDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private Boolean habilitado;
}
