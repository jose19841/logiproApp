package com.logipro.users.service.usecase;


import com.logipro.users.domain.Usuario;

import java.util.Optional;

public interface RegistrarUsuarioUsecase {

    //Registra un usuario nuevo
    Usuario registrar (String usuario, String clave, String nombreRol);

}
