package com.logipro.users.service.usecase;

import com.logipro.users.domain.Usuario;

import java.util.Optional;

public interface BuscarUsuarioUseCase {

    Optional<Usuario> buscar (String usuario);
}
