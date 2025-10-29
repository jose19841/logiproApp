package com.logipro.orders.application.service;

import com.logipro.orders.application.usecase.EliminarPedidoUseCase;
import com.logipro.orders.domain.model.EstadoPedido;
import com.logipro.orders.domain.model.Pedido;
import com.logipro.orders.domain.repository.PedidoRepository;
import io.swagger.v3.oas.annotations.servers.Server;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class EliminarPedidoService implements EliminarPedidoUseCase {

    private final PedidoRepository pedidoRepository;


    @Override
    public void ejecutar(Long id) {
        // Verificar existencia
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado con id: " + id));

        // regla de negocio: no eliminar pedidos finalizados
        if (pedido.getEstado() == EstadoPedido.RECIBIDO) {
            throw new IllegalArgumentException("No se puede eliminar un pedido ya recibido");
        }

        // Eliminar
        try {
            pedidoRepository.delete(pedido);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException("No se puede eliminar el pedido porque esta referenciado en tros registros");
        }
    }
}
