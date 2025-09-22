package com.logipro.users.service.usecase;

/**
 * Caso de uso para cambiar la clave (password) de un usuario.
 * Debe aplicar hashing (p.ej. BCrypt) en la implementación.
 */
public interface CambiarClaveUsecase {

    /**
     * Cambia la clave del usuario indicado.
     *
     * @param userId      ID del usuario
     * @param nuevaClave  clave en claro (la implementación debe hashearla)
     */
    void cambiarClave(Long userId, String nuevaClave);
}
