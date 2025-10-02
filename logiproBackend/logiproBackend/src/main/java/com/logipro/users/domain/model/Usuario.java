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
}
