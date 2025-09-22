package com.logipro.shared.mail.implement;

import com.logipro.shared.mail.MailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class MailServiceImplement implements MailService {

    // Evito problemas del IDE usando nombres totalmente calificados
    private final org.springframework.mail.javamail.JavaMailSender mailSender;
    private final String fromEmail;

    public MailServiceImplement(
            org.springframework.mail.javamail.JavaMailSender mailSender,
            @Value("${spring.mail.username}") String fromEmail
    ) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
    }

    @Override
    public void sendPasswordResetLink(String toEmail, String resetUrl) {
        org.springframework.mail.SimpleMailMessage msg = new org.springframework.mail.SimpleMailMessage();
        msg.setFrom(fromEmail); // debe ser igual a spring.mail.username (Gmail)
        msg.setTo(toEmail);
        msg.setSubject("Restablecer contraseña - LogiPro");
        msg.setText(
                "Restablecer tu contraseña - LogiPro\n\n" +
                        "Usá este enlace (expira en poco tiempo y es de un solo uso):\n\n" +
                        resetUrl + "\n\n" +
                        "Si no solicitaste este cambio, ignorá este mensaje."
        );
        mailSender.send(msg);
    }
}
