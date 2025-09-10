package com.logipro.users.domain;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="rol")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_rol")
    private Long id;
    @Column(name = "nombre", length = 100, nullable = false, unique = true)
    private String nombre;
}
