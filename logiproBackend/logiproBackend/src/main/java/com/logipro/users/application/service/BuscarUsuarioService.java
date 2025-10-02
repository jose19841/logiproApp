package com.logipro.users.application.service;

import com.logipro.users.domain.model.Usuario;
import com.logipro.users.domain.repository.UsuarioRepository;
import com.logipro.users.application.usecase.BuscarUsuarioUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BuscarUsuarioService implements BuscarUsuarioUseCase {

    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> buscar(String usuario) {
        if (usuario == null) return Optional.empty();

        String u = usuario.trim();
        if (u.isEmpty()) return Optional.empty();

        // Respetamos la misma regla de username (4–20) pero SIN lanzar excepción en búsquedas
        if (u.length() < 4 || u.length() > 20) return Optional.empty();

        return usuarioRepository.findByUsuario(u);
    }
}
