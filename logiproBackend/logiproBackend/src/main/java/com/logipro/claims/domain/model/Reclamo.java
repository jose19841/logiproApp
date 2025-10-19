package com.logipro.claims.domain.model;

import com.logipro.supliers.domain.model.Proveedor;
import jakarta.persistence.*;
import lombok.*;

@Getter
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
        establecerNumReclamo(numReclamo);
        establecerDescripcion(descripcion);
        asignarProveedor(proveedor);
        this.estado = estado != null ? estado : EstadoReclamo.PENDIENTE;
    }

    // ===== Lógica de Negocio (DDD) =====


    public void establecerNumReclamo(String numReclamo) {
        if (numReclamo == null || numReclamo.trim().isEmpty()) {
            throw new IllegalArgumentException("El número de reclamo no puede ser vacío");
        }
        this.numReclamo = numReclamo.trim();
    }


    public void establecerDescripcion(String descripcion) {
        if (descripcion == null || descripcion.trim().isEmpty()) {
            throw new IllegalArgumentException("La descripción no puede ser vacía");
        }
        if (descripcion.trim().length() > 500) {
            throw new IllegalArgumentException("La descripción no puede exceder 500 caracteres");
        }
        this.descripcion = descripcion.trim();
    }


    public void actualizarDescripcion(String nuevaDescripcion) {
        establecerDescripcion(nuevaDescripcion);
    }


    public void asignarProveedor(Proveedor proveedor) {
        if (proveedor == null) {
            throw new IllegalArgumentException("El proveedor no puede ser nulo");
        }
        this.proveedor = proveedor;
    }


    public void asignarDetalle(DetalleReclamo detalle) {
        this.detalleReclamo = detalle;
    }


    public void cambiarEstado(EstadoReclamo nuevoEstado) {
        if (nuevoEstado == null) {
            throw new IllegalArgumentException("El estado no puede ser nulo");
        }

        // Validar transiciones de estado
        if (this.estado == EstadoReclamo.CERRADO) {
            throw new IllegalArgumentException(
                "No se puede cambiar el estado de un reclamo CERRADO"
            );
        }

        if (this.estado == EstadoReclamo.RESUELTO && nuevoEstado != EstadoReclamo.CERRADO) {
            throw new IllegalArgumentException(
                "Un reclamo RESUELTO solo puede pasar a CERRADO"
            );
        }

        this.estado = nuevoEstado;
    }


    public boolean estaFinalizado() {
        return this.estado == EstadoReclamo.CERRADO || this.estado == EstadoReclamo.RESUELTO;
    }


    public boolean requiereAtencion() {
        return this.estado == EstadoReclamo.PENDIENTE;
    }

}
