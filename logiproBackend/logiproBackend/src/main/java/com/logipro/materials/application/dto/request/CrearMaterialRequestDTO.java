package com.logipro.materials.application.dto.request;

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

public class CrearMaterialRequestDTO {

    @NotNull(message = "la Cantidad es obligatoria")
    @Min(value = 0, message = "la Cantidad no puede ser negativa")
    private Integer cantidad;

    // Relaciones por ID
    @NotNull(message = "El Reclamo es obligatorio")
    private Long reclamoId;

    @NotNull(message = "el Proveedor es obligatorio")
    private Long proveedorId;

    @NotNull(message = "La calidad es obligatoria")
    private Long calidadId;

    @NotNull(message = "El tipo de Material es obligatorio")
    private Long tipoMaterialId;

}
