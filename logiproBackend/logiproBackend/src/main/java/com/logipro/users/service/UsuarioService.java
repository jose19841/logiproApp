package com.logipro.users.service;

import com.logipro.users.controller.dto.RegistrarUsuarioRequestDTO;
import com.logipro.users.controller.dto.UsuarioResponseDTO;
import com.logipro.users.domain.Usuario;
import com.logipro.users.domain.UserStatus;
import com.logipro.users.infrastructure.UsuarioRepository;
import com.logipro.users.service.mapper.UsuarioMapper;
import com.logipro.users.service.usecase.BuscarUsuarioUseCase;
import com.logipro.users.service.usecase.RegistrarUsuarioUsecase;
import com.logipro.users.service.usecase.ListarUsuarioUsecase;
import com.logipro.users.service.usecase.ActualizarUsuarioUsecase; // 👈 nuevo import
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
    private final ActualizarUsuarioUsecase actualizarUsuarioUsecase; // 👈 nuevo campo

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

    // 👇 Nuevo: orquestación de actualización usando el usecase existente (sin nuevos DTOs)
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
}
