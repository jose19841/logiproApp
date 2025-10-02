package com.logipro.auth.service;

import com.logipro.auth.domain.PasswordResetTokenEntity;
import com.logipro.auth.infrastructure.PasswordResetTokenRepository;
import com.logipro.shared.email.MailService;
import com.logipro.users.domain.model.Usuario;
import com.logipro.users.domain.repository.UsuarioRepository;
import com.logipro.users.service.UsuarioService; // seguimos usando el cambio de clave del servicio
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.time.Duration;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final MailService mailService;
    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository; // ✅ agregado

    @Value("${app.frontend.reset-url:http://localhost:5173/reset}")
    private String frontendResetUrl;

    @Value("${app.password-reset.ttl-minutes:30}")
    private int ttlMinutes;

    /**
     * Paso 1: solicitar reset (acepta usuario o email).
     */
    @Transactional
    public void solicitarReset(String identifier, String ip, String ua) {
        // ✅ Buscar por usuario O email sin revelar existencia
        Optional<Usuario> userOpt = usuarioRepository.findByUsuarioOrEmail(identifier, identifier);
        if (userOpt.isEmpty()) {
            // Importante: no revelar si existe o no
            return;
        }

        Usuario user = userOpt.get();
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            // Si por alguna razón el usuario no tiene email válido, no hacemos nada (silencioso)
            return;
        }

        // Generar token opaco (crudo) + hash (persistimos solo el hash)
        String rawToken = UUID.randomUUID().toString();
        String tokenHash = sha256(rawToken);

        Instant now = Instant.now();
        Instant expires = now.plus(Duration.ofMinutes(ttlMinutes));

        PasswordResetTokenEntity entity = PasswordResetTokenEntity.builder()
                .userId(user.getId())
                .jti(UUID.randomUUID().toString())
                .tokenHash(tokenHash)
                .expiresAt(expires)
                .requestedIp(ip)
                .requestedUserAgent(ua)
                .build();

        tokenRepository.save(entity);

        // Armar URL para el front (token va solo en el enlace, no se guarda en claro)
        String sep = frontendResetUrl.contains("?") ? "&" : "?";
        String resetUrl = frontendResetUrl + sep + "token=" + rawToken;

        // Enviar correo
        mailService.sendPasswordResetLink(user.getEmail(), resetUrl);
    }

    /**
     * Paso 2: confirmar reset (token crudo + nueva clave).
     */
    @Transactional
    public void confirmarReset(String rawToken, String nuevaClave) {
        String tokenHash = sha256(rawToken);
        Instant now = Instant.now();

        PasswordResetTokenEntity token = tokenRepository
                .findByTokenHashAndUsedAtIsNullAndExpiresAtAfter(tokenHash, now)
                .orElseThrow(() -> new IllegalArgumentException("Token inválido o expirado"));

        // Cambiar clave mediante el servicio (aplica hashing/validaciones propias)
        usuarioService.cambiarClave(token.getUserId(), nuevaClave);

        // Marcar token como usado e invalidar otros tokens del usuario
        token.setUsedAt(now);
        tokenRepository.save(token);
        tokenRepository.deleteByUserId(token.getUserId());
    }

    // ===== helpers =====
    private static String sha256(String s) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(md.digest(s.getBytes()));
        } catch (Exception e) {
            throw new IllegalStateException("SHA-256 no disponible", e);
        }
    }
}
