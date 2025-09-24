package com.logipro.config.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class JwtService {

    @Value("${app.jwt.issuer}")
    private String issuer;


    @Value("${app.jwt.secret}")
    private String rawSecret;

    @Value("${app.jwt.access-ttl}")
    private String accessTtlStr;

    @Value("${app.jwt.refresh-ttl}")
    private String refreshTtlStr;

    private SecretKey secretKey;
    private Duration accessTtl;
    private Duration refreshTtl;
    private JwtParser parser;

    // Skew pequeño para tolerancia de reloj
    private static final Duration CLOCK_SKEW = Duration.ofSeconds(30);

    private final Clock clock = Clock.systemUTC();

    @PostConstruct
    void init() {
        if (rawSecret == null || rawSecret.isBlank()) {
            throw new IllegalStateException("app.jwt.secret no puede estar vacío");
        }


        try {
            byte[] keyBytes;
            try {
                // Base64 clásico
                keyBytes = Decoders.BASE64.decode(rawSecret);
            } catch (io.jsonwebtoken.io.DecodingException e1) {
                try {
                    // Base64URL (admite '-' y '_')
                    keyBytes = Decoders.BASE64URL.decode(rawSecret);
                } catch (io.jsonwebtoken.io.DecodingException e2) {
                    // Texto plano UTF-8
                    keyBytes = rawSecret.getBytes(StandardCharsets.UTF_8);
                }
            }
            secretKey = Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception ex) {
            throw new IllegalStateException("No se pudo inicializar la clave JWT", ex);
        }

        accessTtl = Duration.parse(accessTtlStr);
        refreshTtl = Duration.parse(refreshTtlStr);

        parser = Jwts.parserBuilder()
                .requireIssuer(issuer)
                .setAllowedClockSkewSeconds(CLOCK_SKEW.getSeconds())
                .setSigningKey(secretKey)
                .build();
    }

    // ===== Utilidad =====
    public Instant now() {
        return clock.instant();
    }

    // ===== Emisión =====
    public String createAccessToken(Long userId, List<String> roles) {
        Instant now = now();
        Instant exp = now.plus(accessTtl);
        String jti = UUID.randomUUID().toString();

        return Jwts.builder()
                .setIssuer(issuer)
                .setSubject(Long.toString(userId))
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(exp))
                .setId(jti)
                .addClaims(Map.of("roles", roles))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String createRefreshToken(Long userId, String jti) {
        Instant now = now();
        Instant exp = now.plus(refreshTtl);

        return Jwts.builder()
                .setIssuer(issuer)
                .setSubject(Long.toString(userId))
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(exp))
                .setId(jti) // persistido para rotación
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // ===== Parseo / Validación =====
    public AccessClaims parseAccess(String token) {
        try {
            Jws<Claims> jws = parser.parseClaimsJws(token);
            Claims c = jws.getBody();

            long sub = parseSubAsLong(c.getSubject());
            String jti = requireString(c.getId(), "jti");
            @SuppressWarnings("unchecked")
            List<String> roles = (List<String>) c.get("roles", List.class);
            if (roles == null) throw new JwtException("token invalido: falta 'roles'");

            Instant iat = toInstant(c.getIssuedAt());
            Instant exp = toInstant(c.getExpiration());
            return new AccessClaims(sub, roles, jti, iat, exp);

        } catch (JwtException e) {
            throw e; // firma inválida / expirado / issuer distinto
        } catch (Exception e) {
            throw new JwtException("token invalido", e);
        }
    }

    public RefreshClaims parseRefresh(String token) {
        try {
            Jws<Claims> jws = parser.parseClaimsJws(token);
            Claims c = jws.getBody();

            long sub = parseSubAsLong(c.getSubject());
            String jti = requireString(c.getId(), "jti");
            Instant iat = toInstant(c.getIssuedAt());
            Instant exp = toInstant(c.getExpiration());

            if (c.get("roles") != null) {
                throw new JwtException("token invalido: refresh no debe incluir 'roles'");
            }
            return new RefreshClaims(sub, jti, iat, exp);

        } catch (JwtException e) {
            throw e;
        } catch (Exception e) {
            throw new JwtException("token invalido", e);
        }
    }

    // ===== Utilidades =====
    public boolean isExpired(String token) {
        try {
            Jws<Claims> jws = parser.parseClaimsJws(token);
            Date exp = jws.getBody().getExpiration();
            return exp.before(Date.from(now()));
        } catch (JwtException e) {
            return true;
        }
    }

    private static long parseSubAsLong(String sub) {
        if (sub == null || sub.isBlank()) throw new JwtException("token invalido: falta 'sub'");
        try {
            return Long.parseLong(sub);
        } catch (NumberFormatException e) {
            throw new JwtException("token invalido: 'sub' debe ser numerico");
        }
    }

    private static String requireString(String value, String field) {
        if (value == null || value.isBlank()) throw new JwtException("token invalido: falta '" + field + "'");
        return value;
    }

    private static Instant toInstant(Date d) {
        if (d == null) throw new JwtException("token invalido: falta fecha");
        return d.toInstant();
    }

    // ===== Tipos de salida =====
    public record AccessClaims(long sub, List<String> roles, String jti, Instant iat, Instant exp) {}
    public record RefreshClaims(long sub, String jti, Instant iat, Instant exp) {}
}
