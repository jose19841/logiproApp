package com.logipro.users.infrastructure;

import com.logipro.users.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // busca un usuario por su nombre de usuario (login)
    Optional<Usuario> findByUsuario(String usuario);

    // Verifica si ya existe un nombre de usuario (para validar alta)
    boolean existsByUsuario(String usuario);

}
