package com.logipro.users.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "usuario",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_usuario_username",
                columnNames = "usuario"
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    // ===== Datos personales de persona (ahora en usuario) =====
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "apellido", nullable = false, length = 100)
    private String apellido;

    @Column(name = "dni", nullable = false, unique = true, length = 25)
    private String dni;

    @Column(name = "telefono", length = 25)
    private String telefono;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "domicilio", length = 100)
    private String domicilio;

    // ===== Datos de login =====
    @Column(name = "usuario", nullable = false, length = 20, unique = true)
    private String usuario;

    @Column(name = "clave", nullable = false, length = 100)
    private String clave;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 12)
    private UserStatus estado;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(
            name = "id_rol",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_usuario_rol")
    )
    private Rol rol;

    @PrePersist
    void prePersist() {
        if (estado == null) estado = UserStatus.REGISTRADO;
    }

    // ===== Lógica de Negocio (DDD) =====

    /**
     * Activa un usuario registrado o suspendido
     */
    public void activar() {
        if (this.estado == UserStatus.ACTIVO) {
            throw new IllegalStateException("El usuario ya está activo");
        }
        this.estado = UserStatus.ACTIVO;
    }

    /**
     * Suspende un usuario activo
     */
    public void suspender() {
        if (this.estado == UserStatus.SUSPENDIDO) {
            throw new IllegalStateException("El usuario ya está suspendido");
        }
        this.estado = UserStatus.SUSPENDIDO;
    }

    /**
     * Marca el usuario como inactivo
     */
    public void inactivar() {
        if (this.estado == UserStatus.INACTIVO) {
            throw new IllegalStateException("El usuario ya está inactivo");
        }
        this.estado = UserStatus.INACTIVO;
    }

    /**
     * Cambia el estado del usuario a uno específico con validaciones
     */
    public void cambiarEstado(UserStatus nuevoEstado) {
        if (nuevoEstado == null) {
            throw new IllegalArgumentException("El estado no puede ser nulo");
        }
        if (this.estado == nuevoEstado) {
            throw new IllegalStateException("El usuario ya tiene el estado: " + nuevoEstado);
        }
        this.estado = nuevoEstado;
    }

    /**
     * Actualiza la contraseña del usuario (ya encriptada)
     */
    public void cambiarClave(String claveEncriptada) {
        if (claveEncriptada == null || claveEncriptada.trim().isEmpty()) {
            throw new IllegalArgumentException("La clave encriptada no puede estar vacía");
        }
        this.clave = claveEncriptada;
    }

    /**
     * Actualiza los datos personales del usuario
     */
    public void actualizarDatosPersonales(String nombre, String apellido, String dni,
                                          String telefono, String email, String domicilio) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre no puede estar vacío");
        }
        if (apellido == null || apellido.trim().isEmpty()) {
            throw new IllegalArgumentException("El apellido no puede estar vacío");
        }
        if (dni == null || dni.trim().isEmpty()) {
            throw new IllegalArgumentException("El DNI no puede estar vacío");
        }

        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.telefono = telefono;
        this.email = email;
        this.domicilio = domicilio;
    }

    /**
     * Actualiza el nombre de usuario (login)
     */
    public void actualizarUsuario(String nuevoUsuario) {
        if (nuevoUsuario == null || nuevoUsuario.trim().isEmpty()) {
            throw new IllegalArgumentException("El usuario no puede estar vacío");
        }
        this.usuario = nuevoUsuario;
    }

    /**
     * Asigna un rol al usuario
     */
    public void asignarRol(Rol rol) {
        if (rol == null) {
            throw new IllegalArgumentException("El rol no puede ser nulo");
        }
        this.rol = rol;
    }

    // ===== Consultas de Negocio =====

    /**
     * Verifica si el usuario está activo
     */
    public boolean estaActivo() {
        return this.estado == UserStatus.ACTIVO;
    }

    /**
     * Verifica si el usuario puede iniciar sesión
     */
    public boolean puedeIniciarSesion() {
        return this.estado == UserStatus.ACTIVO;
    }

    /**
     * Verifica si el usuario está suspendido
     */
    public boolean estaSuspendido() {
        return this.estado == UserStatus.SUSPENDIDO;
    }

    /**
     * Verifica si el usuario está registrado pero no activado
     */
    public boolean estaRegistrado() {
        return this.estado == UserStatus.REGISTRADO;
    }

    /**
     * Obtiene el nombre completo del usuario
     */
    public String getNombreCompleto() {
        return this.nombre + " " + this.apellido;
    }
}
