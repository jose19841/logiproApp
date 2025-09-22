package com.logipro.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * Request para iniciar el flujo de recuperación de contraseña.
 * El campo "identifier" puede ser el username del usuario.
 */
@Getter
@Setter
public class ForgotPasswordRequestDTO {

    @NotBlank
    private String identifier;
}