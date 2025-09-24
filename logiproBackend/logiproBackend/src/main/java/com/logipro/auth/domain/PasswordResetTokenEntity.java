package com.logipro.auth.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(
        name = "password_reset_tokens",
        indexes = {
                @Index(name = "idx_prt_token_hash", columnList = "token_hash", unique = true),
                @Index(name = "idx_prt_user_id", columnList = "user_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetTokenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Usuario dueño del token */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** JTI (identificador lógico del token)*/
    @Column(name = "jti", nullable = false, length = 64)
    private String jti;

    /** Hash del token */
    @Column(name = "token_hash", nullable = false, length = 64, unique = true)
    private String tokenHash;

    /** Fecha/hora de expiración */
    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    /** Fecha/hora de uso (null = no usado) */
    @Column(name = "used_at")
    private Instant usedAt;


    @Column(name = "requested_ip", length = 64)
    private String requestedIp;

    @Column(name = "requested_user_agent", length = 512)
    private String requestedUserAgent;

    /** Creado en */
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
