package com.logipro.users.service.implement;

import com.logipro.users.domain.Usuario;
import com.logipro.users.infrastructure.UsuarioRepository;
import com.logipro.users.service.usecase.CambiarClaveUsecase;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementación del caso de uso para cambiar la clave de un usuario.
 */
@Service
@RequiredArgsConstructor
public class CambiarClaveService implements CambiarClaveUsecase {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void cambiarClave(Long userId, String nuevaClave) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID " + userId));

        // hasheamos antes de guardar
        usuario.setClave(passwordEncoder.encode(nuevaClave));

        usuarioRepository.save(usuario);
    }
}
