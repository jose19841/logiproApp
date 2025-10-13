package com.logipro.claims.domain.model;

import com.logipro.supliers.domain.model.Proveedor;
import jakarta.persistence.*;
import lombok.*;

import java.util.Optional;

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


     @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_proveedor", nullable = false)
     private Proveedor proveedor;


    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoReclamo estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_detalle_reclamo")
    private DetalleReclamo detalleReclamo;

/* ======= Constructor de conveniencia ======= */
public Reclamo (String numReclamo, String descripcion, Proveedor proveedor, EstadoReclamo estado) {
    this.numReclamo = numReclamo.trim();
    this.descripcion = descripcion.trim();
    this.proveedor = proveedor;
    this.estado = estado;
}
/* ======= Métodos de dominio básicos ======= */
public void actualizarDescripcion(String nuevaDescripcion) {
    this.descripcion = nuevaDescripcion == null ? this.descripcion : nuevaDescripcion.trim();
}

    public void asignarProveedor(Proveedor nuevoProveedor) {
        if (nuevoProveedor != null) this.proveedor = nuevoProveedor;
    }

    public void cambiarEstado(EstadoReclamo nuevoEstado) {
        if (nuevoEstado != null) this.estado = nuevoEstado;
    }

}
