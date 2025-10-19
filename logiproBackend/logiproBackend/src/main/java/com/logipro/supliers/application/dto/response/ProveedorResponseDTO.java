package com.logipro.supliers.application.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Builder
public class ProveedorResponseDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private Boolean habilitado;
}
