package com.logipro.users.application.service;

import com.logipro.users.domain.model.Usuario;
import com.logipro.users.domain.repository.UsuarioRepository;
import com.logipro.users.application.usecase.CambiarMiClaveUsecase;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementación del caso de uso para que un usuario autenticado
 * cambie su propia clave validando la actual.
 */
@Service
@RequiredArgsConstructor
public class CambiarMiClaveService implements CambiarMiClaveUsecase {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    // Opcional: revocar refresh tokens activos al cambiar clave
    // private final RefreshTokenService refreshTokenService;

    @Override
    @Transactional
    public void cambiarMiClave(Long userId, String claveActual, String nuevaClave) {
        if (userId == null) {
            throw new IllegalArgumentException("Usuario inválido");
        }

        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        if (!passwordEncoder.matches(claveActual, usuario.getClave())) {
            throw new IllegalArgumentException("La clave actual es incorrecta");
        }

        if (nuevaClave == null || nuevaClave.length() < 8 || nuevaClave.length() > 64) {
            throw new IllegalArgumentException("La nueva clave no cumple la política");
        }

        usuario.setClave(passwordEncoder.encode(nuevaClave));
        usuarioRepository.save(usuario);

        // Si quisieras, revocás refresh tokens acá
        // refreshTokenService.revokeAllForUser(userId);
    }
}
