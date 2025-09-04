package com.logipro.users.controller.dto;


import com.logipro.users.domain.UserStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioResponseDTO {
    private Long id;
    private String usuario;
    private String rol;
    private UserStatus estado;
}
