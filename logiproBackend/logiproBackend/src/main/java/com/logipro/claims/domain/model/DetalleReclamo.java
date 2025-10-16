package com.logipro.claims.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "detalle_reclamo")
@Getter
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
    /**
     * Crea un nuevo detalle de reclamo con validación
     * @param descripcion Descripción del detalle
     * @return DetalleReclamo nuevo
     * @throws IllegalArgumentException si la descripción es inválida
     */
    public static DetalleReclamo crear(String descripcion){
        if(descripcion == null || descripcion.isBlank()){
            throw new IllegalArgumentException("La descripción es obligatoria");
        }
        if(descripcion.trim().length() > 255){
            throw new IllegalArgumentException("La descripción no puede exceder 255 caracteres");
        }
        DetalleReclamo detalle = new DetalleReclamo();
        detalle.descripcion = descripcion.trim();
        return detalle;
    }
}
