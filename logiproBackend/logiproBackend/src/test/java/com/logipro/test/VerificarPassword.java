package com.logipro.test;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class VerificarPassword {
    public static void main(String[] args) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        // Contraseña cifrada almacenada en la base de datos
        String storedPassword = "$2a$12$P5l0vtftMpnbr5iXNCPVQul/NAqeG0Y5.WCdMVmfGbo3FOODsEdVK"; // La contraseña cifrada

        // Contraseña ingresada (debería ser 'password')
        String rawPassword = "passwrd";

        boolean matches = passwordEncoder.matches(rawPassword, storedPassword);

        System.out.println("¿Contraseña válida? " + matches); // Esto debe devolver true si la contraseña es correcta
    }
}
