package com.logipro.supliers.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
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
        this.nombre=nombre.trim();
        this.descripcion= (descripcion != null)? descripcion.trim() : null;
    }
    public void actualizarNombre(String nombre) {
        this.nombre = nombre.trim();
    }

    public void actualizarDescripcion(String descripcion) {
        this.descripcion = (descripcion != null && !descripcion.trim().isEmpty())
                ? descripcion.trim()
                : null;
    }

}
