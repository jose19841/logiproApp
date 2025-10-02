package com.logipro.users.application.usecase;

import com.logipro.users.domain.model.Usuario;

import java.util.Optional;

public interface BuscarUsuarioUseCase {

    Optional<Usuario> buscar (String usuario);
}
