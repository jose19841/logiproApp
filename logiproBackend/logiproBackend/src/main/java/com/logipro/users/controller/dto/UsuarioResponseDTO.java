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
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private String domicilio;
    private String dni;
    private String rol;
    private UserStatus estado;
}
