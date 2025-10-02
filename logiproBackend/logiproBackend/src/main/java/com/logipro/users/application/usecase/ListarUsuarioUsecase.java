package com.logipro.users.application.usecase;

import com.logipro.users.domain.model.Usuario; // entidad del dominio
import java.util.List; // colección genérica de Java

public interface ListarUsuarioUsecase {
    List<Usuario> listar();
}
