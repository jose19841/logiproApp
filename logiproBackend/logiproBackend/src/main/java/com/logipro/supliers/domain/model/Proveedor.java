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

    @Column(name = "direccion", length = 200)
    private String direccion;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @Column(name = "habilitado", nullable = false)
    private Boolean habilitado = true;

    public Proveedor(String nombre, String descripcion, String direccion, String telefono){
        establecerNombre(nombre);
        actualizarDescripcion(descripcion);
        actualizarDireccion(direccion);
        actualizarTelefono(telefono);
        this.habilitado = true;
    }

    // ===== Lógica de Negocio (DDD) =====


    public void establecerNombre(String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del proveedor no puede ser vacío");
        }
        if (nombre.trim().length() > 100) {
            throw new IllegalArgumentException("El nombre no puede exceder 100 caracteres");
        }
        this.nombre = nombre.trim();
    }


    public void actualizarNombre(String nombre) {
        establecerNombre(nombre);
    }


    public void actualizarDescripcion(String descripcion) {
        if (descripcion != null && descripcion.trim().length() > 255) {
            throw new IllegalArgumentException("La descripción no puede exceder 255 caracteres");
        }
        this.descripcion = (descripcion != null && !descripcion.trim().isEmpty())
                ? descripcion.trim()
                : null;
    }


    public void actualizarDireccion(String direccion) {
        if (direccion != null && direccion.trim().length() > 200) {
            throw new IllegalArgumentException("La dirección no puede exceder 200 caracteres");
        }
        this.direccion = (direccion != null && !direccion.trim().isEmpty())
                ? direccion.trim()
                : null;
    }


    public void actualizarTelefono(String telefono) {
        if (telefono != null && telefono.trim().length() > 20) {
            throw new IllegalArgumentException("El teléfono no puede exceder 20 caracteres");
        }
        this.telefono = (telefono != null && !telefono.trim().isEmpty())
                ? telefono.trim()
                : null;
    }


    public void habilitar() {
        this.habilitado = true;
    }


    public void inhabilitar() {
        this.habilitado = false;
    }


    public boolean estaHabilitado() {
        return this.habilitado != null && this.habilitado;
    }

}
