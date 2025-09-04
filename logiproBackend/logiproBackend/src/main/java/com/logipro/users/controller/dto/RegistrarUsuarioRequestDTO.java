package com.logipro.users.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "clave") // evita imprimir la password si alguien Loguea el objeto
public class RegistrarUsuarioRequestDTO {

    @NotBlank(message = "El nombre de usuario es obligatorio.")
    @Size(min = 4, max = 20, message = "El nombre de usuario debe tener entre 4 y 20 caracteres.")
    private String usuario;

    @NotBlank(message = "La clave es obligatoria.")
    @Size(min=8, max = 20, message = "la clave debe tener entre 8 y 20 caracteres.")
    private String clave;

    @NotBlank(message = "El rol es Obligatrio (ADMIN o USER)")
    private String rol;


}
