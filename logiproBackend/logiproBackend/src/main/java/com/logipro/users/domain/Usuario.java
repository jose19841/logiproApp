package com.logipro.users.domain;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    // nombre de usuario para login
    @Column(name = "usuario", nullable = false, length = 20, unique = true)
    private String usuario;

    // contraseña encriptada (byCrypt 60 chars)
    @Column(name = "clave", nullable = false, length = 60)
    private String clave;

    // estado  del usuario (solo ACTIVO podra loguear)
    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 12)
    private UserStatus estado;

    // fk o rol
    @ManyToOne(optional = false)
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;

    @PrePersist
    void prePersist(){
        if(estado==null) estado= UserStatus.REGISTRADO;
}

}
