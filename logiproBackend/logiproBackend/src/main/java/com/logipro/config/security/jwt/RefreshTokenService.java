package com.logipro.config.security.jwt;

import com.logipro.config.security.jwt.model.RefreshTokenEntity;   // (lo creamos en el siguiente paso)
import com.logipro.config.security.jwt.repository.RefreshTokenRepository;
import io.jsonwebtoken.JwtException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final JwtService jwtService;
    private final RefreshTokenRepository repo;

    public RefreshTokenService(JwtService jwtService, RefreshTokenRepository repo) {
        this.jwtService = jwtService;
        this.repo = repo;
    }


    @Transactional
    public String createAndStoreRefreshToken(long userId) {
        String jti = UUID.randomUUID().toString();
        String refreshJwt = jwtService.createRefreshToken(userId, jti);

        // Obtenemos exp/iat desde el propio token para persistirlo correctamente
        var claims = jwtService.parseRefresh(refreshJwt);
        Instant expiresAt = claims.exp();
        Instant issuedAt  = claims.iat();

        RefreshTokenEntity entity = new RefreshTokenEntity();
        entity.setJti(jti);
        entity.setUserId(userId);
        entity.setIssuedAt(issuedAt);
        entity.setExpiresAt(expiresAt);
        entity.setRevoked(false);

        repo.save(entity);
        return refreshJwt;
    }


    @Transactional
    public RotationResult rotate(String refreshJwt) {
        var claims = jwtService.parseRefresh(refreshJwt);
        long userId = claims.sub();
        String oldJti = claims.jti();

        RefreshTokenEntity stored = repo.findByJti(oldJti)
                .orElseThrow(() -> new JwtException("refresh no reconocido"));

        assertActive(stored);

        // Revocamos el anterior
        stored.setRevoked(true);
        repo.save(stored);

        // Creamos el nuevo
        String newJti = UUID.randomUUID().toString();
        String newRefreshJwt = jwtService.createRefreshToken(userId, newJti);
        var newClaims = jwtService.parseRefresh(newRefreshJwt);

        RefreshTokenEntity next = new RefreshTokenEntity();
        next.setJti(newJti);
        next.setUserId(userId);
        next.setIssuedAt(newClaims.iat());
        next.setExpiresAt(newClaims.exp());
        next.setRevoked(false);
        repo.save(next);

        return new RotationResult(userId, oldJti, newJti, newRefreshJwt);
    }

    /**
     * Revoca un refresh por JTI (logout de un solo dispositivo, por ejemplo).
     */
    @Transactional
    public void revokeByJti(String jti) {
        Optional<RefreshTokenEntity> opt = repo.findByJti(jti);
        opt.ifPresent(token -> {
            if (!token.isRevoked()) {
                token.setRevoked(true);
                repo.save(token);
            }
        });
    }

    /**
     * Revoca todos los refresh del usuario (logout global).
     */
    @Transactional
    public void revokeAllForUser(long userId) {
        List<RefreshTokenEntity> tokens = repo.findAllByUserId(userId);
        for (RefreshTokenEntity token : tokens){
            token.setRevoked(true);
        }
        repo.saveAll(tokens);
    }

    /**
     * Chequeo simple de actividad/vencimiento.
     */
    private void assertActive(RefreshTokenEntity e) {
        if (e.isRevoked()) {
            throw new JwtException("refresh revocado");
        }
        if (e.getExpiresAt() == null || e.getExpiresAt().isBefore(jwtService.now())) {
            throw new JwtException("refresh expirado");
        }
    }


    public record RotationResult(long userId, String oldJti, String newJti, String newRefreshToken) {}
}
