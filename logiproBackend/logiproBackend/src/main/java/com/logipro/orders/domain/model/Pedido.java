package com.logipro.orders.domain.model;

import com.logipro.supliers.domain.model.Proveedor;
import com.logipro.users.domain.model.Usuario;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedido")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_pedido", nullable = false, unique = true, length = 30)
    private String numeroPedido;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_proveedor", nullable = false,
    foreignKey = @ForeignKey(name = "fk_pedido_proveedor"))
    private Proveedor proveedor;

    @Column(name = "fecha_pedido", nullable = false)
    private LocalDate fechaPedido;

    @Column(name = "fecha_entrega_estimada")
    private LocalDate fechaEntregaEstimada;

    @Column(name = "fecha_entrega_real")
    private LocalDate fechaEntregaReal;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 20)
    private EstadoPedido estado;

    @Builder.Default
    @Column(name = "monto_total", precision = 18, scale = 2, nullable = false)
    private BigDecimal montoTotal = BigDecimal.ZERO;

    @Column(name = "observaciones", length = 500)
    private String observaciones;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario", nullable = false,
    foreignKey = @ForeignKey(name="fk_pedido_usuario"))
    private Usuario usuarioCreador;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DetallePedido> detalles = new ArrayList<>();

    @CreatedDate
    @Column(name = "fecha_creacion", updatable = false)
    private Instant fechaCreacion;

    @LastModifiedDate
    @Column(name = "fecha_actualizacion")
    private Instant fechaActualizacion;

    /* ===================== MÉTODOS DE DOMINIO ===================== */

    public void agregarDetalle(DetallePedido detalle) {
        if(detalle == null) return;
        detalle.setPedido(this);
        this.detalles.add(detalle);
        recalcularTotales();
    }

    public void quitarDetalle(DetallePedido detalle) {
        if(detalle == null) return;
        this.detalles.remove(detalle);
        detalle.setPedido(null);
        recalcularTotales();
    }

    public void marcarEnProceso() {
        validarTransicion(EstadoPedido.PENDIENTE, EstadoPedido.EN_PROCESO);
        this.estado = EstadoPedido.EN_PROCESO;
    }

    public void cancelar() {
        if(this.estado == EstadoPedido.RECIBIDO) {
            throw new IllegalStateException("No se puede cancelar un pedido recibido");
        }
        this.estado = EstadoPedido.CANCELADO;
    }

    /** Registrar la recepción completa (fecha real + totales recalculados).
     *  La actualización efectiva del inventario se hará en la capa de aplicación. */

    public void registrarRecepcion(LocalDate fechaEntregaReal) {
        if(this.estado == EstadoPedido.CANCELADO) {
            throw new IllegalStateException("No se puede recibir un pedido cancelado");
        }
        this.estado = EstadoPedido.RECIBIDO;
        this.fechaEntregaReal = fechaEntregaReal;
        recalcularTotales();
    }

    public void recalcularTotales() {
        this.montoTotal = this.detalles.stream()
        .map(DetallePedido::getSubtotal)
        .filter(v -> v != null)
        .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private void validarTransicion(EstadoPedido esperado, EstadoPedido siguiente) {
        if(this.estado != esperado) {
            throw new IllegalStateException("transicion invalida: " + this.estado + " -> " + siguiente);
        }
    }
}
