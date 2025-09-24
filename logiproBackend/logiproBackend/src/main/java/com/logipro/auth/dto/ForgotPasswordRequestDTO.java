package com.logipro.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ForgotPasswordRequestDTO {

    @NotBlank
    private String identifier;
}