package com.logipro.users.application.usecase;

import com.logipro.users.application.dto.request.RegistrarUsuarioRequestDTO;
import com.logipro.users.domain.model.Usuario;

import java.util.Optional;

public interface ActualizarUsuarioUsecase {
    /**
     * Actualiza los datos del usuario usando el DTO de registro.
     * @param id  ID del usuario a actualizar
     * @param dto Datos a sobrescribir (nombre, apellido, dni, telefono, email, domicilio, usuario, clave, rol)
     * @return Usuario actualizado (si existe)
     */
    Optional<Usuario> actualizar(Long id, RegistrarUsuarioRequestDTO dto);
}
