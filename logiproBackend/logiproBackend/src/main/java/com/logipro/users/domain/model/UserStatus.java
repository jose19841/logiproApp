package com.logipro.users.domain.model;
/**
 * Estados del ciclo de vida del usuario.
 * Solo los usuarios en estado ACTIVO podrán iniciar sesión.
 * Importante: por regla de negocio no se elimina físicamente ningún usuario.
 */

public enum UserStatus {
    REGISTRADO,
    ACTIVO,
    INACTIVO,
    SUSPENDIDO
}
