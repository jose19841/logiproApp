package com.logipro.supliers.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * ========== REQUEST DTO: Crear Proveedor ==========
 * Representa los datos necesarios para registrar un nuevo proveedor.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CrearProveedorRequestDTO {

    @NotBlank(message = "El nombre es obliagatorio")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")

    private String nombre;

    @NotBlank(message = "La descripcion del proveedor es obligatoria")
    @Size(max = 255, message = "la descripcion no puede superar los 255 caracteres")

    private String descripcion;
}
