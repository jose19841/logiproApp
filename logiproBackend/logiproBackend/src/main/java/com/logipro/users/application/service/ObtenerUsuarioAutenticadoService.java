package com.logipro.users.application.service;

import com.logipro.users.application.usecase.ObtenerUsuarioAutenticadoUseCase;
import com.logipro.users.domain.model.Usuario;
import com.logipro.users.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ObtenerUsuarioAutenticadoService implements ObtenerUsuarioAutenticadoUseCase {

    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerPorUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            return Optional.empty();
        }
        return usuarioRepository.findByUsuario(username);
    }
}
