package com.logipro.auth.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * Request para confirmar la recuperación de contraseña.
 */
@Getter
@Setter
public class ResetPasswordRequestDTO {

    @NotBlank
    private String token;

    @NotBlank
    private String nuevaClave;
}
