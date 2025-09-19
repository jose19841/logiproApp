package com.logipro.users.service.usecase;

import com.logipro.users.controller.dto.RegistrarUsuarioRequestDTO;
import com.logipro.users.domain.Usuario;

public interface RegistrarUsuarioUsecase {

    // Registra un usuario nuevo a partir del DTO
    Usuario registrar(RegistrarUsuarioRequestDTO request);

}
