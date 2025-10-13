package com.logipro.claims.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CrearReclamoRequestDTO {

    @NotBlank(message = "el numero de reclamo es obligatorio")
    @Size(max=50,message = "El numero de reclamo no puede superarlos 50 caracteres")
    private String numReclamo;

    @NotBlank(message = "Ladescripcion es obligatoria")
    @Size(max = 1000, message = "La descripcion no puedesuperar los 1000 caracteres")
    private String descripcion;

    @NotNull(message = "El proveedor es obligatorio")
    private Long proveedorId;

    private String estado;

    // Opcional: se puede asignar después
    private Long detalleReclamoId;
}
