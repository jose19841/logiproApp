package com.logipro.auth.infrastructure.persistence;

import com.logipro.auth.domain.model.PasswordResetTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface JpaPasswordResetTokenRepository extends JpaRepository<PasswordResetTokenEntity, Long> {
    /** Busca por hash  */
    Optional<PasswordResetTokenEntity> findByTokenHash(String tokenHash);

    /** Válido: no usado y no expirado. */
    Optional<PasswordResetTokenEntity> findByTokenHashAndUsedAtIsNullAndExpiresAtAfter(String tokenHash, Instant now);

    /** Lookup por JTI (útil para auditoría). */
    Optional<PasswordResetTokenEntity> findByJti(String jti);

    /** Limpieza de expirados. */
    int deleteByExpiresAtBefore(Instant now);

    /** Invalidar todos los tokens de un usuario (tras un reset). */
    int deleteByUserId(Long userId);
}

