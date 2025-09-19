package com.logipro.users.service.usecase;

import com.logipro.users.domain.Usuario; // entidad del dominio
import java.util.List; // colección genérica de Java

public interface ListarUsuarioUsecase {
    List<Usuario> listar();
}
