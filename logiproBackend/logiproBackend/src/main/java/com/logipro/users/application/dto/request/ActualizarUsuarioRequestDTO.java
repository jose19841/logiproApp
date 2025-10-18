package com.logipro.users.application.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActualizarUsuarioRequestDTO {

    // ===== Datos personales =====
    @NotBlank(message = "El nombre es obligatorio.")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres.")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio.")
    @Size(max = 100, message = "El apellido no puede superar los 100 caracteres.")
    private String apellido;

    @NotBlank(message = "El DNI es obligatorio.")
    @Size(max = 25, message = "El DNI no puede superar los 25 caracteres.")
    private String dni;

    @Size(max = 25, message = "El teléfono no puede superar los 25 caracteres.")
    private String telefono;

    @Email(message = "El email debe ser válido.")
    @Size(max = 100, message = "El email no puede superar los 100 caracteres.")
    private String email;

    @Size(max = 100, message = "El domicilio no puede superar los 100 caracteres.")
    private String domicilio;

    // ===== Datos de login =====
    @NotBlank(message = "El nombre de usuario es obligatorio.")
    @Size(min = 4, max = 20, message = "El nombre de usuario debe tener entre 4 y 20 caracteres.")
    private String usuario;

    @NotBlank(message = "El rol es obligatorio (ADMIN o USER).")
    private String rol;

    // NOTA: La clave NO se actualiza aquí, se usa el endpoint específico /mi-clave
}
