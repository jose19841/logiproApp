package com.logipro.shared.mail;

/**
 * Servicio de envío de correos.
 * Mantiene la abstracción para no acoplar la aplicación a una implementación específica.
 * Implementaciones típicas: JavaMail (SMTP).
 */
public interface MailService {
    /**
     * Envía el enlace de restablecimiento de contraseña al destinatario.
     *
     * @param toEmail  correo del destinatario
     * @param resetUrl enlace absoluto (frontend) para restablecer la contraseña
     */
    void sendPasswordResetLink(String toEmail, String resetUrl);
}

