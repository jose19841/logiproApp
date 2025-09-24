package com.logipro.shared.email.implement;

import com.logipro.shared.email.MailService;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Year;
import java.util.Scanner;

@Service
public class MailServiceImplement implements MailService {

    private final JavaMailSender mailSender;
    private final String fromEmail;
    private final ResourceLoader resourceLoader;

    public MailServiceImplement(
            JavaMailSender mailSender,
            ResourceLoader resourceLoader,
            @Value("${spring.mail.username}") String fromEmail
    ) {
        this.mailSender = mailSender;
        this.resourceLoader = resourceLoader;
        this.fromEmail = fromEmail;
    }

    @Override
    public void sendPasswordResetLink(String toEmail, String resetUrl) {
        try {
            // 1) Cargar plantilla desde classpath (primero resetPassword.html, luego reset-password.html)
            String html = loadTemplateOrThrow(
                    "classpath:templates/resetPassword.html",
                    "classpath:templates/reset-password.html"
            );

            // 2) Reemplazar variables
            html = html.replace("{{resetUrl}}", resetUrl)
                    .replace("{{toEmail}}", toEmail)
                    .replace("{{supportEmail}}", fromEmail)
                    .replace("{{year}}", String.valueOf(Year.now().getValue()))
                    .replace("{{username_optional}}", ""); // opcional

            // 3) Enviar como HTML
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, false, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Restablecer contraseña - LogiPro");
            helper.setText(html, true);
            mailSender.send(mime);

        } catch (Exception e) {
            throw new RuntimeException("Error enviando email de recuperación: "
                    + e.getClass().getSimpleName() + " - " + (e.getMessage() == null ? "(sin mensaje)" : e.getMessage()), e);
        }
    }

    // === helpers ===
    private String loadTemplateOrThrow(String primaryLocation, String fallbackLocation) throws Exception {
        String html = tryLoad(primaryLocation);
        if (html != null) return html;

        html = tryLoad(fallbackLocation);
        if (html != null) return html;

        throw new IllegalStateException(
                "No se encontró la plantilla en " + primaryLocation + " ni en " + fallbackLocation +
                        ". Verificá que exista en src/main/resources/templates/ con alguno de esos nombres."
        );
    }

    private String tryLoad(String location) throws Exception {
        Resource resource = resourceLoader.getResource(location);
        if (!resource.exists()) return null;
        try (Scanner scanner = new Scanner(resource.getInputStream(), StandardCharsets.UTF_8)) {
            scanner.useDelimiter("\\A");
            return scanner.hasNext() ? scanner.next() : "";
        }
    }
}
