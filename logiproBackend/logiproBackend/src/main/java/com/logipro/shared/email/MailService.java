package com.logipro.shared.email;


public interface MailService {
    /**
     * Envía el enlace de restablecimiento de contraseña al destinatario.
     *
     * @param toEmail  correo del destinatario
     * @param resetUrl enlace absoluto (frontend) para restablecer la contraseña
     */
    void sendPasswordResetLink(String toEmail, String resetUrl);
}

