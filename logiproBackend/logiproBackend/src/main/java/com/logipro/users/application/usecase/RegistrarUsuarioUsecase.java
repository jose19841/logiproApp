package com.logipro.users.application.usecase;

import com.logipro.users.application.dto.request.RegistrarUsuarioRequestDTO;
import com.logipro.users.domain.model.Usuario;

public interface RegistrarUsuarioUsecase {

    // Registra un usuario nuevo a partir del DTO
    Usuario registrar(RegistrarUsuarioRequestDTO request);

}
