package com.logipro.orders.domain.model;

import com.logipro.materials.domain.model.Material;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Table(name = "detalle_pedido")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetallePedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "id_pedido",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_detalle_pedido_pedido")
    )
    @ToString.Exclude
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "id_material",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_detalle_pedido_material")
    )
    private Material material;

    @Column(name = "cantidad_solicitada", nullable = false)
    private Integer cantidadSolicitada;

    @Column(name = "cantidad_recibida")
    private Integer cantidadRecibida;

    @Column(name = "precio_unitario", precision = 18, scale = 2, nullable = false)
    private BigDecimal precioUnitario;

    /** Subtotal del renglón: por modelo, se calcula como cantidadSolicitada * precioUnitario. */
    @Column(name = "subtotal", precision = 18, scale = 2, nullable = false)
    private BigDecimal subtotal;

    /* ===================== REGLAS DE DOMINIO ===================== */
    @PrePersist
    @PreUpdate
    private void preCalcular(){
        recalcularSubtotal();
    }

    public void setCantidadSolicitada(Integer cantidadSolicitada) {
        validarCantidadNoNegativa(cantidadSolicitada, "cantidad solicitada");
        this.cantidadSolicitada = cantidadSolicitada;
        recalcularSubtotal();
    }

    public void setCantidadRecibida(Integer cantidadRecibida) {
        validarCantidadNoNegativa(cantidadRecibida, "cantidad recibida");
        this.cantidadRecibida = cantidadRecibida;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        if(precioUnitario == null || precioUnitario.signum() <0) {
            throw new IllegalArgumentException("Precio unitario no puede ser nulo ni negativo");
        }
        this.precioUnitario = precioUnitario.setScale(2, RoundingMode.HALF_UP);
        recalcularSubtotal();
    }

    public void asignarPedido(Pedido pedido) {
        this.pedido = pedido;
        if(pedido != null && !pedido.getDetalles().contains(this)) {
            pedido.getDetalles().add(this);
            pedido.recalcularTotales();
        }
    }

    public void recalcularSubtotal(){
        if(this.cantidadSolicitada == null || this.precioUnitario == null) {
            this.subtotal = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
            return;
        }
        this.subtotal = this.precioUnitario
                .multiply(BigDecimal.valueOf(this.cantidadSolicitada))
                .setScale(2, RoundingMode.HALF_UP);
    }
    private void validarCantidadNoNegativa(Integer valor, String campo) {
        if(valor != null && valor < 0) {
            throw new IllegalArgumentException(campo + "no puede ser negativa");
        }
    }
}
