package com.logipro.users.application.usecase;

import com.logipro.users.domain.model.Usuario;

import java.util.Optional;

public interface ObtenerUsuarioAutenticadoUseCase {

    /**
     * Obtiene el usuario autenticado actual por su nombre de usuario (login)
     *
     * @param username nombre de usuario del usuario autenticado
     * @return Optional con el usuario si existe
     */
    Optional<Usuario> obtenerPorUsername(String username);
}
