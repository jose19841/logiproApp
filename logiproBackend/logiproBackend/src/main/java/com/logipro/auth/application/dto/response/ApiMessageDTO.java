package com.logipro.auth.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO simple para devolver un mensaje genérico en las respuestas.
 */
@Getter
@Setter
@AllArgsConstructor
public class ApiMessageDTO {
    private String message;
}
