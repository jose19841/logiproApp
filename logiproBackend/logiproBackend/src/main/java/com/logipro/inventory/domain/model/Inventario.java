package com.logipro.inventory.domain.model;

import com.logipro.materials.domain.model.Material;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Inventario")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Inventario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private long id;

    @Column(name = "Cantidad Minima", nullable = false)
    private Integer cantidadMinima;

    @Column(name = "Cantidad Maxima")
    private Integer cantidadMaxima;

    // relacion con sector
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "id_sector", nullable = false)
    private Sector sector;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "id_material", nullable = false)
    private Material material;

    // ===== Lógica de Negocio (DDD) =====


    public void establecerCantidades(Integer cantidadMinima, Integer cantidadMaxima) {
        if (cantidadMinima == null || cantidadMinima < 0) {
            throw new IllegalArgumentException("La cantidad mínima no puede ser negativa o nula");
        }
        if (cantidadMaxima == null || cantidadMaxima < 0) {
            throw new IllegalArgumentException("La cantidad máxima no puede ser negativa o nula");
        }
        if (cantidadMaxima < cantidadMinima) {
            throw new IllegalArgumentException("La cantidad máxima debe ser mayor o igual a la cantidad mínima");
        }
        this.cantidadMinima = cantidadMinima;
        this.cantidadMaxima = cantidadMaxima;
    }


    public void actualizarRelaciones(Sector sector, Material material) {
        if (sector == null) {
            throw new IllegalArgumentException("El sector no puede ser nulo");
        }
        if (material == null) {
            throw new IllegalArgumentException("El material no puede ser nulo");
        }
        this.sector = sector;
        this.material = material;
    }


    public boolean estaEnNivelCritico() {
        return this.cantidadMaxima != null && this.cantidadMinima != null
            && (this.cantidadMaxima - this.cantidadMinima) < 5;
    }


    public boolean tieneMargenAmplio() {
        return this.cantidadMaxima != null && this.cantidadMinima != null
            && (this.cantidadMaxima - this.cantidadMinima) > 100;
    }
}
