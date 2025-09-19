package com.logipro.users.service.implement;

import com.logipro.users.controller.dto.RegistrarUsuarioRequestDTO;
import com.logipro.users.domain.Usuario;
import com.logipro.users.infrastructure.UsuarioRepository;
import com.logipro.users.infrastructure.RolRepository;
import com.logipro.users.service.usecase.ActualizarUsuarioUsecase;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Implementación del caso de uso para actualizar un usuario
 * usando el DTO existente de registro (sin crear nuevos DTOs).
 */
@Service
@RequiredArgsConstructor
public class ActualizarUsuarioService implements ActualizarUsuarioUsecase {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository; // se usa para resolver el rol por nombre

    @Override
    @Transactional
    public Optional<Usuario> actualizar(Long id, RegistrarUsuarioRequestDTO dto) {
        if (id == null) return Optional.empty();

        return usuarioRepository.findById(id).map(u -> {
            // Actualizamos campos SOLO si vienen informados en el DTO
            if (dto.getNombre() != null)     u.setNombre(dto.getNombre());
            if (dto.getApellido() != null)   u.setApellido(dto.getApellido());
            if (dto.getDni() != null)        u.setDni(dto.getDni());
            if (dto.getTelefono() != null)   u.setTelefono(dto.getTelefono());
            if (dto.getEmail() != null)      u.setEmail(dto.getEmail());
            if (dto.getDomicilio() != null)  u.setDomicilio(dto.getDomicilio());
            if (dto.getUsuario() != null)    u.setUsuario(dto.getUsuario());

            // Rol por nombre (String) → entidad Rol
            if (dto.getRol() != null) {
                var rol = rolRepository.findByNombre(dto.getRol())
                        .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado: " + dto.getRol()));
                u.setRol(rol);
            }


            return usuarioRepository.save(u);
        });
    }
}
