package com.logipro.auth.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ForgotPasswordRequestDTO {

    @NotBlank
    private String identifier;
}