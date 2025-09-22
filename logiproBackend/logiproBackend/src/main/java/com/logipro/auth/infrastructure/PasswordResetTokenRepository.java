package com.logipro.auth.infrastructure;

import com.logipro.auth.domain.PasswordResetTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetTokenEntity, Long> {
    /** Busca por hash (nunca por el token en claro). */
    Optional<PasswordResetTokenEntity> findByTokenHash(String tokenHash);

    /** Válido: no usado y no expirado. */
    Optional<PasswordResetTokenEntity> findByTokenHashAndUsedAtIsNullAndExpiresAtAfter(String tokenHash, Instant now);

    /** Lookup por JTI (útil para auditoría). */
    Optional<PasswordResetTokenEntity> findByJti(String jti);

    /** Limpieza de expirados. */
    int deleteByExpiresAtBefore(Instant now);

    /** Invalidar todos los tokens de un usuario (p.ej., tras un reset). */
    int deleteByUserId(Long userId);
}

