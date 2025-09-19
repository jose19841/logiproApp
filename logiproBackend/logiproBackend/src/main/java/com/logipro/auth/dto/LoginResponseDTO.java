package com.logipro.auth.dto;

import com.logipro.users.controller.dto.UsuarioResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Respuesta de /auth/login
 * Incluye access token y refresh token.
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private String accessToken;
    private String refreshToken;
    private UsuarioResponseDTO user;
}
