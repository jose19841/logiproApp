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

    /**
     * Establece el número de reclamo con validación
     * @param numReclamo Número único del reclamo
     * @throws IllegalArgumentException si el número es inválido
     */
    public void establecerNumReclamo(String numReclamo) {
        if (numReclamo == null || numReclamo.trim().isEmpty()) {
            throw new IllegalArgumentException("El número de reclamo no puede ser vacío");
        }
        this.numReclamo = numReclamo.trim();
    }

    /**
     * Establece la descripción con validación
     * @param descripcion Descripción del reclamo
     * @throws IllegalArgumentException si la descripción es inválida
     */
    public void establecerDescripcion(String descripcion) {
        if (descripcion == null || descripcion.trim().isEmpty()) {
            throw new IllegalArgumentException("La descripción no puede ser vacía");
        }
        if (descripcion.trim().length() > 500) {
            throw new IllegalArgumentException("La descripción no puede exceder 500 caracteres");
        }
        this.descripcion = descripcion.trim();
    }

    /**
     * Actualiza la descripción del reclamo
     * @param nuevaDescripcion Nueva descripción
     */
    public void actualizarDescripcion(String nuevaDescripcion) {
        establecerDescripcion(nuevaDescripcion);
    }

    /**
     * Asigna un proveedor al reclamo
     * @param proveedor Proveedor asociado
     * @throws IllegalArgumentException si el proveedor es nulo
     */
    public void asignarProveedor(Proveedor proveedor) {
        if (proveedor == null) {
            throw new IllegalArgumentException("El proveedor no puede ser nulo");
        }
        this.proveedor = proveedor;
    }

    /**
     * Asigna detalle al reclamo
     * @param detalle Detalle del reclamo (puede ser null)
     */
    public void asignarDetalle(DetalleReclamo detalle) {
        this.detalleReclamo = detalle;
    }

    /**
     * Cambia el estado del reclamo validando transiciones válidas
     * @param nuevoEstado Nuevo estado
     * @throws IllegalArgumentException si la transición no es válida
     */
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

    /**
     * Verifica si el reclamo está en estado final
     * @return true si está cerrado o resuelto
     */
    public boolean estaFinalizado() {
        return this.estado == EstadoReclamo.CERRADO || this.estado == EstadoReclamo.RESUELTO;
    }

    /**
     * Verifica si el reclamo requiere atención urgente
     * @return true si está pendiente
     */
    public boolean requiereAtencion() {
        return this.estado == EstadoReclamo.PENDIENTE;
    }

}
