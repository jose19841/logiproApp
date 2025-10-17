package com.logipro.materials.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "calidad")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Calidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_calidad")
    private Long id;

    @Column(name = "fecha_inspeccion", nullable = false)
    private Instant fechaInspeccion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_detalle_calidad")
    private DetalleCalidad detalleCalidad;
}
