package com.logipro.users.service.usecase;

/**
 * Caso de uso para que un usuario autenticado cambie su propia clave.
 *
 * A diferencia de CambiarClaveUsecase (que permite setear una nueva clave sin validar la actual,
 * pensado para administradores o flujos de recuperación), este caso de uso valida que la clave
 * actual ingresada por el usuario coincida con la almacenada antes de actualizar.
 */
public interface CambiarMiClaveUsecase {

    /**
     * Cambia la clave del usuario autenticado.
     *
     * @param userId       ID del usuario autenticado (extraído del token)
     * @param claveActual  clave actual en claro (se validará contra el hash persistido)
     * @param nuevaClave   nueva clave en claro (la implementación debe hashearla antes de guardar)
     */
    void cambiarMiClave(Long userId, String claveActual, String nuevaClave);
}
