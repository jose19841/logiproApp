package com.logipro.materials.domain.model;

import com.logipro.claims.domain.model.Reclamo;
import com.logipro.supliers.domain.model.Proveedor;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Table(name = "material")
@EntityListeners(AuditingEntityListener.class)
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_material")
    private Long id;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    // ===== Relaciones =====
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_reclamo")
    private Reclamo reclamo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_provedor")
    private Proveedor proveedor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_calidad")
    private Calidad calidad;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_tipo_material")
    private TipoMaterial tipoMaterial;

    // ===== Auditoría =====
    @CreatedDate
    @Column(name = "fecha_creacion", updatable = false)
    private Instant fechaCreacion;

    @LastModifiedDate
    @Column(name = "fecha_actualizacion")
    private Instant fechaActualizacion;

    // ===== Lógica de Negocio (DDD) =====


    public void cambiarCantidad(Integer nuevaCantidad) {
        if (nuevaCantidad == null || nuevaCantidad < 0) {
            throw new IllegalArgumentException("La cantidad no puede ser negativa o nula");
        }
        this.cantidad = nuevaCantidad;
    }


    public void actualizarRelaciones(Reclamo reclamo, Proveedor proveedor, Calidad calidad, TipoMaterial tipoMaterial) {
        this.reclamo = reclamo;
        this.proveedor = proveedor;
        this.calidad = calidad;
        this.tipoMaterial = tipoMaterial;
    }


    public boolean requiereInspeccionAdicional() {
        return this.cantidad != null && this.cantidad > 1000;
    }


    public boolean tieneStockBajo() {
        return this.cantidad != null && this.cantidad < 10;
    }
}
