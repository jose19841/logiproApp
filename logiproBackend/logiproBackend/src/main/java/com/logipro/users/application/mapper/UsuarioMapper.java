package com.logipro.users.application.mapper;

import com.logipro.users.application.dto.request.ActualizarUsuarioRequestDTO;
import com.logipro.users.application.dto.request.RegistrarUsuarioRequestDTO;
import com.logipro.users.application.dto.response.UsuarioResponseDTO;
import com.logipro.users.domain.model.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public UsuarioResponseDTO toResponse(Usuario u) {
        if (u == null) return null;
        return UsuarioResponseDTO.builder()
                .id(u.getId())
                .usuario(u.getUsuario())
                .nombre(u.getNombre())
                .apellido(u.getApellido())
                .email(u.getEmail())
                .telefono(u.getTelefono())
                .domicilio(u.getDomicilio())
                .dni(u.getDni())
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

    /**
     * Actualiza una entidad existente con los datos del DTO de actualización
     * Usa métodos de dominio para mantener la lógica de negocio
     */
    public void updateEntityFromDTO(Usuario usuario, ActualizarUsuarioRequestDTO dto) {
        if (usuario == null || dto == null) return;

        // Usar métodos de dominio en vez de setters directos
        usuario.actualizarDatosPersonales(
                dto.getNombre(),
                dto.getApellido(),
                dto.getDni(),
                dto.getTelefono(),
                dto.getEmail(),
                dto.getDomicilio()
        );

        usuario.actualizarUsuario(dto.getUsuario());
        // Rol se asigna en el service con asignarRol()
    }
}