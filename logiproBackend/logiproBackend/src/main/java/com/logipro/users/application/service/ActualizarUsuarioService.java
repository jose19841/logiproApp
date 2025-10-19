package com.logipro.users.application.service;

import com.logipro.users.application.dto.request.RegistrarUsuarioRequestDTO;
import com.logipro.users.domain.model.Usuario;
import com.logipro.users.domain.repository.UsuarioRepository;
import com.logipro.users.domain.repository.RolRepository;
import com.logipro.users.application.usecase.ActualizarUsuarioUsecase;
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
            // ✅ USAR MÉTODOS DE DOMINIO en vez de setters directos
            // Actualizar datos personales
            u.actualizarDatosPersonales(
                    dto.getNombre() != null ? dto.getNombre() : u.getNombre(),
                    dto.getApellido() != null ? dto.getApellido() : u.getApellido(),
                    dto.getDni() != null ? dto.getDni() : u.getDni(),
                    dto.getTelefono() != null ? dto.getTelefono() : u.getTelefono(),
                    dto.getEmail() != null ? dto.getEmail() : u.getEmail(),
                    dto.getDomicilio() != null ? dto.getDomicilio() : u.getDomicilio()
            );

            // Actualizar usuario (login)
            if (dto.getUsuario() != null) {
                u.actualizarUsuario(dto.getUsuario());
            }

            // Asignar rol usando método de dominio
            if (dto.getRol() != null) {
                var rol = rolRepository.findByNombre(dto.getRol())
                        .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado: " + dto.getRol()));
                u.asignarRol(rol);
            }

            return usuarioRepository.save(u);
        });
    }
}
