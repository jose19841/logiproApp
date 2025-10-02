package com.logipro.users.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CambiarClaveRequestDTO {

    @NotBlank
    private String claveActual;

    @NotBlank
    @Size(min = 6, max = 64)
    private String nuevaClave;

    @NotBlank
    @Size(min = 6, max = 64)
    private String confirmarClave;
}
