package com.logipro.users.application.service;

import com.logipro.users.application.dto.request.ActualizarUsuarioRequestDTO;
import com.logipro.users.application.dto.request.RegistrarUsuarioRequestDTO;
import com.logipro.users.application.dto.response.UsuarioResponseDTO;
import com.logipro.users.domain.model.Rol;
import com.logipro.users.domain.model.Usuario;
import com.logipro.users.domain.model.UserStatus;
import com.logipro.users.domain.repository.RolRepository;
import com.logipro.users.domain.repository.UsuarioRepository;
import com.logipro.users.application.mapper.UsuarioMapper;
import com.logipro.users.application.usecase.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final RegistrarUsuarioUsecase registrarUsuarioUsecase;
    private final BuscarUsuarioUseCase buscarUsuarioUseCase;
    private final UsuarioMapper usuarioMapper;
    private final UsuarioRepository usuarioRepository;
    private final ListarUsuarioUsecase listarUsuarioUseCase;
    private final ActualizarUsuarioUsecase actualizarUsuarioUsecase;
    private final CambiarClaveUsecase cambiarClaveUsecase;           // admin / sin validar clave actual
    private final CambiarMiClaveUsecase cambiarMiClaveUsecase;       // self-service / valida clave actual
    private final RolRepository rolRepository;

    @Transactional
    public UsuarioResponseDTO registrar(RegistrarUsuarioRequestDTO dto) {
        Usuario u = registrarUsuarioUsecase.registrar(dto);

        // ✅ USAR MÉTODO DE DOMINIO en vez de setter
        u.activar(); // activar usuario al registrarlo vía API
        usuarioRepository.save(u);

        return usuarioMapper.toResponse(u);
    }

    public Optional<UsuarioResponseDTO> buscarPorUsuario(String username) {
        return buscarUsuarioUseCase.buscar(username)
                .map(usuarioMapper::toResponse);
    }

    public Optional<UsuarioResponseDTO> buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .map(usuarioMapper::toResponse);
    }

    public List<UsuarioResponseDTO> listar() {
        return listarUsuarioUseCase.listar()
                .stream()
                .map(usuarioMapper::toResponse)
                .collect(Collectors.toList());
    }

    // ✅ NUEVO: Actualizar usando el DTO específico de actualización
    @Transactional
    public Optional<UsuarioResponseDTO> actualizar(Long id, ActualizarUsuarioRequestDTO dto) {
        return usuarioRepository.findById(id).map(usuario -> {
            // Validar que el username no esté duplicado (si cambió)
            if (!usuario.getUsuario().equals(dto.getUsuario())) {
                usuarioRepository.findByUsuario(dto.getUsuario()).ifPresent(existente -> {
                    if (!existente.getId().equals(id)) {
                        throw new IllegalArgumentException("El nombre de usuario ya existe: " + dto.getUsuario());
                    }
                });
            }

            // Validar que el DNI no esté duplicado (si cambió)
            if (!usuario.getDni().equals(dto.getDni())) {
                usuarioRepository.findAll().stream()
                        .filter(u -> u.getDni().equals(dto.getDni()) && !u.getId().equals(id))
                        .findFirst()
                        .ifPresent(existente -> {
                            throw new IllegalArgumentException("El DNI ya existe: " + dto.getDni());
                        });
            }

            // Resolver y asignar rol usando método de dominio
            Rol rol = rolRepository.findByNombre(dto.getRol())
                    .orElseThrow(() -> new IllegalArgumentException("Rol no encontrado: " + dto.getRol()));
            usuario.asignarRol(rol);

            // ✅ USAR MAPPER que usa métodos de dominio
            usuarioMapper.updateEntityFromDTO(usuario, dto);

            return usuarioMapper.toResponse(usuarioRepository.save(usuario));
        });
    }

    // ⚠️ DEPRECATED: Mantener por compatibilidad temporal, delegar al nuevo método
    @Deprecated
    @Transactional
    public Optional<UsuarioResponseDTO> actualizarConRegistroDTO(Long id, RegistrarUsuarioRequestDTO dto) {
        return actualizarUsuarioUsecase.actualizar(id, dto)
                .map(usuarioMapper::toResponse);
    }

    @Transactional
    public Optional<UsuarioResponseDTO> cambiarEstado(Long id, UserStatus nuevoEstado) {
        return usuarioRepository.findById(id).map(u -> {
            // ✅ USAR MÉTODO DE DOMINIO en vez de setter
            u.cambiarEstado(nuevoEstado);
            usuarioRepository.save(u);
            return usuarioMapper.toResponse(u);
        });
    }

    // === Admin / soporte: setear nueva clave sin validar la actual (ya existente) ===
    @Transactional
    public void cambiarClave(Long id, String nuevaClave) {
        cambiarClaveUsecase.cambiarClave(id, nuevaClave);
    }

    // === Self-service: usuario autenticado cambia su propia clave (valida claveActual) ===
    @Transactional
    public void cambiarMiClave(Long id, String claveActual, String nuevaClave) {
        cambiarMiClaveUsecase.cambiarMiClave(id, claveActual, nuevaClave);
    }
}
