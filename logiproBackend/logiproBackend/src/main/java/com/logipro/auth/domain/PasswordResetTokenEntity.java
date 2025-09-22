package com.logipro.auth.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(
        name = "password_reset_tokens",
        indexes = {
                @Index(name = "idx_prt_token_hash", columnList = "token_hash", unique = true),
                @Index(name = "idx_prt_user_id", columnList = "user_id")
        }
)
public class PasswordResetTokenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Usuario dueño del token */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** JTI (identificador lógico del token), útil para auditoría */
    @Column(name = "jti", nullable = false, length = 64)
    private String jti;

    /** Hash del token (NUNCA guardar el token en claro) */
    @Column(name = "token_hash", nullable = false, length = 64, unique = true)
    private String tokenHash;

    /** Fecha/hora de expiración */
    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    /** Fecha/hora de uso (null = no usado) */
    @Column(name = "used_at")
    private Instant usedAt;

    /** Auditoría opcional */
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

    // ===== Getters & Setters =====

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getJti() {
        return jti;
    }
    public void setJti(String jti) {
        this.jti = jti;
    }

    public String getTokenHash() {
        return tokenHash;
    }
    public void setTokenHash(String tokenHash) {
        this.tokenHash = tokenHash;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }
    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Instant getUsedAt() {
        return usedAt;
    }
    public void setUsedAt(Instant usedAt) {
        this.usedAt = usedAt;
    }

    public String getRequestedIp() {
        return requestedIp;
    }
    public void setRequestedIp(String requestedIp) {
        this.requestedIp = requestedIp;
    }

    public String getRequestedUserAgent() {
        return requestedUserAgent;
    }
    public void setRequestedUserAgent(String requestedUserAgent) {
        this.requestedUserAgent = requestedUserAgent;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
