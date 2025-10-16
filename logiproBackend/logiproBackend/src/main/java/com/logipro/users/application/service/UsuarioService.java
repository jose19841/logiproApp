package com.logipro.users.application.service;

import com.logipro.users.application.dto.request.RegistrarUsuarioRequestDTO;
import com.logipro.users.application.dto.response.UsuarioResponseDTO;
import com.logipro.users.domain.model.Usuario;
import com.logipro.users.domain.model.UserStatus;
import com.logipro.users.domain.repository.UsuarioRepository;
import com.logipro.users.application.mapper.UsuarioMapper;
import com.logipro.users.application.usecase.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors; // para collect(Collectors.toList())

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

    @Transactional
    public UsuarioResponseDTO registrar(RegistrarUsuarioRequestDTO dto) {
        Usuario u = registrarUsuarioUsecase.registrar(dto);

        // activar usuario al registrarlo vía API
        u.setEstado(UserStatus.ACTIVO);
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

    // orquestación de actualización usando el usecase existente (sin nuevos DTOs)
    @Transactional
    public Optional<UsuarioResponseDTO> actualizar(Long id, RegistrarUsuarioRequestDTO dto) {
        return actualizarUsuarioUsecase.actualizar(id, dto)
                .map(usuarioMapper::toResponse);
    }

    @Transactional
    public Optional<UsuarioResponseDTO> cambiarEstado(Long id, UserStatus nuevoEstado) {
        return usuarioRepository.findById(id).map(u -> {
            u.setEstado(nuevoEstado);
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
