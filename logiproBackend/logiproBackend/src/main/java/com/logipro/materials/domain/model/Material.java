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
@Setter
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_provedor")
    private Proveedor proveedor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_calidad")
    private Calidad calidad;

     @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_material")
    private TipoMaterial tipoMaterial;

    // ===== Auditoría =====
    @CreatedDate
    @Column(name = "fecha_creacion", updatable = false)
    private Instant fechaCreacion;

    @LastModifiedDate
    @Column(name = "fecha_actualizacion")
    private Instant fechaActualizacion;
}
