package com.logipro.config.security.jwt;

import com.logipro.users.domain.UserStatus;
import com.logipro.users.domain.Usuario;
import com.logipro.users.infrastructure.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public JwtAuthFilter(JwtService jwtService, UsuarioRepository usuarioRepository) {
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Ya hay auth? seguir.
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (!StringUtils.hasText(header) || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        try {
            // Validar y extraer claims
            JwtService.AccessClaims claims = jwtService.parseAccess(token);

            // Verificar usuario en DB y estado
            long userId = claims.sub();
            Usuario u = usuarioRepository.findById(userId).orElse(null);
            if (u == null || u.getEstado() != UserStatus.ACTIVO) {
                filterChain.doFilter(request, response);
                return;
            }

            // Mapear roles -> authorities Spring Security (ROLE_*)
            List<SimpleGrantedAuthority> authorities = claims.roles().stream()
                    .filter(StringUtils::hasText)
                    .map(r -> r.startsWith("ROLE_") ? r : "ROLE_" + r)
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());

            AbstractAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(u.getUsuario(), null, authorities);

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception ex) {
            // token inválido / expirado → seguimos sin autenticar (terminará en 401 si la ruta lo exige)
        }

        filterChain.doFilter(request, response);
    }
}
