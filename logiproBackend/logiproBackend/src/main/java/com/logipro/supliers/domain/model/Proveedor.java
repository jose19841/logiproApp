package com.logipro.supliers.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "proveedor")

public class Proveedor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_proveedor")
    private Long id;

    @Column(name = "nombre", length = 100, nullable = false)
    private String nombre;

    @Column(name = "descripcion", length = 255)
    private String descripcion;

    public Proveedor(String nombre, String descripcion){
        establecerNombre(nombre);
        actualizarDescripcion(descripcion);
    }

    // ===== Lógica de Negocio (DDD) =====

    /**
     * Establece el nombre del proveedor con validación de reglas de negocio
     * @param nombre Nombre del proveedor
     * @throws IllegalArgumentException si el nombre es inválido
     */
    public void establecerNombre(String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del proveedor no puede ser vacío");
        }
        if (nombre.trim().length() > 100) {
            throw new IllegalArgumentException("El nombre no puede exceder 100 caracteres");
        }
        this.nombre = nombre.trim();
    }

    /**
     * Actualiza el nombre del proveedor
     * @param nombre Nuevo nombre
     */
    public void actualizarNombre(String nombre) {
        establecerNombre(nombre);
    }

    /**
     * Actualiza la descripción del proveedor
     * @param descripcion Nueva descripción (puede ser null)
     */
    public void actualizarDescripcion(String descripcion) {
        if (descripcion != null && descripcion.trim().length() > 255) {
            throw new IllegalArgumentException("La descripción no puede exceder 255 caracteres");
        }
        this.descripcion = (descripcion != null && !descripcion.trim().isEmpty())
                ? descripcion.trim()
                : null;
    }

}
