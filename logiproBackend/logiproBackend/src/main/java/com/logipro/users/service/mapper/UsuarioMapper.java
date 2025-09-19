package com.logipro.users.service.mapper;

import com.logipro.users.controller.dto.RegistrarUsuarioRequestDTO;
import com.logipro.users.controller.dto.UsuarioResponseDTO;
import com.logipro.users.domain.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public UsuarioResponseDTO toResponse(Usuario u) {
        if (u == null) return null;
        return UsuarioResponseDTO.builder()
                .id(u.getId())
                .usuario(u.getUsuario())
                .rol(u.getRol() != null ? u.getRol().getNombre() : null)
                .estado(u.getEstado())
                .build();
    }

    // Mapea DTO de alta -> entidad (sin rol ni estado; la clave se encripta en el servicio)
    public Usuario toEntity(RegistrarUsuarioRequestDTO dto) {
        if (dto == null) return null;
        return Usuario.builder()
                .nombre(dto.getNombre())
                .apellido(dto.getApellido())
                .dni(dto.getDni())
                .telefono(dto.getTelefono())
                .email(dto.getEmail())
                .domicilio(dto.getDomicilio())
                .usuario(dto.getUsuario())
                .clave(dto.getClave()) // se encripta en el service
                .build();
    }
}
