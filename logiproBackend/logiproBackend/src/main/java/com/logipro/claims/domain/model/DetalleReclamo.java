package com.logipro.claims.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "detalle_reclamo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleReclamo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle_reclamo")
    private Long id;

    @Column(name = "descripcion", length = 255, nullable = false)
    private String descripcion;

    // ===== Factory Method =====
    public static DetalleReclamo crear(String descripcion){
        if(descripcion == null || descripcion.isBlank()){
            throw new IllegalArgumentException("la descripcion es obligatoria");
        }
        DetalleReclamo detalle = new DetalleReclamo();
        detalle.descripcion = descripcion.trim();
        return detalle;
    }
}
