package com.logipro.shared.exceptions;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    // 409 Conflict – errores de registro (duplicados, reglas de negocio específicas)
    @ExceptionHandler(UserRegisterException.class)
    public ResponseEntity<Map<String, Object>> handleUserRegister(UserRegisterException ex,
                                                                  HttpServletRequest req) {
        return build(HttpStatus.CONFLICT, "CONFLICTO", ex.getMessage(), req.getRequestURI(), null);
    }

    // 400 Bad Request – validaciones de @Valid en DTOs
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex,
                                                                HttpServletRequest req) {
        var detalles = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> Map.of("campo", err.getField(), "mensaje", err.getDefaultMessage()))
                .collect(Collectors.toList());

        return build(HttpStatus.BAD_REQUEST, "VALIDACION_FALLIDA",
                "Uno o más campos no son válidos.", req.getRequestURI(), detalles);
    }

    // 400 Bad Request – argumentos inválidos desde la capa de servicio
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex,
                                                                     HttpServletRequest req) {
        return build(HttpStatus.BAD_REQUEST, "PETICION_INVALIDA", ex.getMessage(), req.getRequestURI(), null);
    }

    // 409 Conflict – operaciones no permitidas por estado del sistema (ej: eliminar con dependencias)
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalState(IllegalStateException ex,
                                                                  HttpServletRequest req) {
        return build(HttpStatus.CONFLICT, "OPERACION_NO_PERMITIDA", ex.getMessage(), req.getRequestURI(), null);
    }

    // 404 Not Found – entidad no encontrada
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(EntityNotFoundException ex,
                                                              HttpServletRequest req) {
        return build(HttpStatus.NOT_FOUND, "NO_ENCONTRADO", ex.getMessage(), req.getRequestURI(), null);
    }

    // (Opcional) 500 – cualquier otro error no manejado
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex, HttpServletRequest req) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "ERROR_INTERNO",
                "Ocurrió un error inesperado.", req.getRequestURI(), null);
    }

    // Utilidad para construir el cuerpo de error
    private ResponseEntity<Map<String, Object>> build(HttpStatus status,
                                                      String error,
                                                      String mensaje,
                                                      String path,
                                                      Object detalles) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", error);
        body.put("mensaje", mensaje);
        body.put("path", path);
        if (detalles != null) body.put("detalles", detalles);
        return ResponseEntity.status(status).body(body);
    }
    // 4xx/5xx definidos con ResponseStatusException (respeta código y mensaje)
    @ExceptionHandler(org.springframework.web.server.ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatus(
            org.springframework.web.server.ResponseStatusException ex,
            jakarta.servlet.http.HttpServletRequest req
    ) {
        var status = org.springframework.http.HttpStatus.valueOf(ex.getStatusCode().value());
        var reason = ex.getReason(); // p.ej. "Usuario inactivo" o "Usuario o contraseña incorrectos"
        return build(status, status.getReasonPhrase(), reason, req.getRequestURI(), null);
    }

}

