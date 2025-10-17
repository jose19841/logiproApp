package com.logipro.materials.application.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
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

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser mayor que 0")
    private Integer cantidad;

    // Relaciones por ID
    private Long reclamoId;  // Opcional

    @NotNull(message = "El proveedor es obligatorio")
    private Long proveedorId;

    @NotNull(message = "El tipo de material es obligatorio")
    private Long tipoMaterialId;

    // Datos de inspección (en lugar de calidadId)
    @NotBlank(message = "El resultado de la inspección es obligatorio")
    private String resultadoInspeccion;  // "Bueno", "Regular", "Malo"

    private String observacionesInspeccion;  // Opcional

}
