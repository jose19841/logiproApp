package com.logipro.materials.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tipo_material")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TipoMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_material", length =100, nullable = false)
    private String nombre;

    @Column(name = "descripcion", length = 255)
    private String descripcion;
}
