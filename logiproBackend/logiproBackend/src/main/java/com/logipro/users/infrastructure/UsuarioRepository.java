package com.logipro.users.infrastructure;

import com.logipro.users.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Búsqueda por nombre de usuario (login)
    Optional<Usuario> findByUsuario(String usuario);
    boolean existsByUsuario(String usuario);

    // ✅ Búsqueda por email
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);

    // ✅ Opcional: una sola query que matchea usuario O email
    Optional<Usuario> findByUsuarioOrEmail(String usuario, String email);
}
