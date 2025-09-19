package com.logipro.config.security.jwt.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(
        name = "refresh_tokens",
        uniqueConstraints = @UniqueConstraint(name = "uk_refresh_jti", columnNames = "jti"),
        indexes = {
                @Index(name = "idx_refresh_user", columnList = "user_id"),
                @Index(name = "idx_refresh_expires", columnList = "expires_at")
        }
)
@Getter
@Setter
public class RefreshTokenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // id del usuario dueño del refresh
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // identificador del token (jti) que guardamos en validación/rotación
    @Column(name = "jti", nullable = false, length = 64)
    private String jti;

    // fechas en UTC, Hibernate se encarga del mapeo con TIMESTAMP/DATETIME
    @Column(name = "issued_at", nullable = false)
    private Instant issuedAt;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "revoked", nullable = false)
    private boolean revoked = false;
}
