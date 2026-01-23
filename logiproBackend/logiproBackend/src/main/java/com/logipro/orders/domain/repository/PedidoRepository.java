package com.logipro.orders.domain.repository;

import com.logipro.orders.domain.model.EstadoPedido;
import com.logipro.orders.domain.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    Optional<Pedido> findByNumeroPedido(String numeroPedido);

    boolean existsByNumeroPedido(String numeroPedido);

    List<Pedido> findByEstado(EstadoPedido estado);

    // Por proveedor (usa la relación ManyToOne de Pedido → Proveedor)
    List<Pedido> findByProveedor_id(Long proveedorId);

    List<Pedido> findByFechaPedidoBetween(LocalDate desde, LocalDate hasta);

    List<Pedido> findByEstadoIn(List<EstadoPedido> estados);

    // Buscar último pedido del año (para generar correlativo)
    Optional<Pedido> findFirstByNumeroPedidoStartingWithOrderByNumeroPedidoDesc(String prefix);
}
