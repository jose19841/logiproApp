package com.logipro.claims.domain;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "reclamo")
public class Reclamo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reclamo")
    private Long id;

    @Column(name = "num_reclamo", nullable = false, unique = true)
    private String numReclamo;

    @Column(name = "descripcion", nullable = false, length = 500)
    private String descripcion;

    // ⚠️ Futuras relaciones (cuando tengamos los módulos correspondientes):
    // @ManyToOne
    // @JoinColumn(name = "id_proveedor", nullable = false)
    // private Proveedor proveedor;

    // @OneToOne(mappedBy = "reclamo")
    // private DetalleReclamo detalle;

    // @Enumerated(EnumType.STRING)
    // @Column(name = "estado", nullable = false)
    // private Estado estado;
}
