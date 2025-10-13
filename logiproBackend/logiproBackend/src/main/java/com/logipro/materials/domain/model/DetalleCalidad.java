package com.logipro.materials.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "detalle_calidad")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetalleCalidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "resultado", length = 100, nullable = false)
    private String resultado;

    @Column(name="observaciones", length = 255)
    private String observaciones;

}
