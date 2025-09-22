package com.logipro.auth.service;

import com.logipro.auth.domain.PasswordResetTokenEntity;
import com.logipro.auth.infrastructure.PasswordResetTokenRepository;
import com.logipro.shared.mail.MailService;
import com.logipro.users.controller.dto.UsuarioResponseDTO;
import com.logipro.users.service.UsuarioService; // si tu paquete/clase difiere, decime y lo cambio
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

    @Value("${app.frontend.reset-url:http://localhost:5173/reset}")
    private String frontendResetUrl;

    @Value("${app.password-reset.ttl-minutes:30}")
    private int ttlMinutes;

    /**
     * Paso 1: solicitar reset (no revela si el usuario existe).
     * identifier: username del usuario (según tu UsuarioService actual).
     */
    @Transactional
    public void solicitarReset(String identifier, String ip, String ua) {
        // Usamos el método real disponible en tu UsuarioService
        Optional<UsuarioResponseDTO> dtoOpt = usuarioService.buscarPorUsuario(identifier);

        if (dtoOpt.isEmpty()) {
            // No revelamos existencia de usuario.
            return;
        }

        UsuarioResponseDTO dto = dtoOpt.get();
        UsuarioMin user = new UsuarioMin(dto.getId(), dto.getEmail());

        // Generar token opaco (crudo) + hash (persistimos solo el hash)
        String rawToken = UUID.randomUUID().toString();
        String tokenHash = sha256(rawToken);

        Instant now = Instant.now();
        Instant expires = now.plus(Duration.ofMinutes(ttlMinutes));

        // Sin Lombok builder para evitar dependencias aquí
        PasswordResetTokenEntity entity = new PasswordResetTokenEntity();
        entity.setUserId(user.id());
        entity.setJti(UUID.randomUUID().toString());
        entity.setTokenHash(tokenHash);
        entity.setExpiresAt(expires);
        entity.setRequestedIp(ip);
        entity.setRequestedUserAgent(ua);

        tokenRepository.save(entity);

        // Armar URL para el front
        String sep = frontendResetUrl.contains("?") ? "&" : "?";
        String resetUrl = frontendResetUrl + sep + "token=" + rawToken;

        // Enviar correo
        mailService.sendPasswordResetLink(user.email(), resetUrl);
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

        // Cambiar contraseña con tu servicio de usuarios (ajustá si tu método se llama distinto)
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

    private record UsuarioMin(Long id, String email) {}
}
