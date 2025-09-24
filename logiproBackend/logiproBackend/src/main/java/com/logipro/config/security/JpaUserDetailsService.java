package com.logipro.config.security;

import com.logipro.users.domain.UserStatus;
import com.logipro.users.domain.Usuario;
import com.logipro.users.infrastructure.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JpaUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario u = usuarioRepository.findByUsuario(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        // Aseguramos que el nombre del rol esté en mayúsculas
        String roleName = (u.getRol() != null && u.getRol().getNombre() != null)
                ? u.getRol().getNombre()
                : "USER";
        if (roleName.startsWith("ROLE_")) {
            roleName = roleName.substring(5);
        }
        roleName = roleName.toUpperCase();

        return User.withUsername(u.getUsuario())
                .password(u.getClave()) // Usamos la clave directamente, ya está codificada
                .roles(roleName)        // .roles añade ROLE_ automáticamente
                .disabled(u.getEstado() != UserStatus.ACTIVO)
                .build();
    }
}
