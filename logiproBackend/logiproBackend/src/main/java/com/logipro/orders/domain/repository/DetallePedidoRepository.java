package com.logipro.orders.domain.repository;

import com.logipro.orders.domain.model.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {

    List<DetallePedido> findByPedido_id(Long pediddoId);

    List<DetallePedido> findByMaterial_id(Long materialId);

    DetallePedido findByPedido_idAndMaterial_id(Long pedidoId, Long materialId);
}
