package com.logipro.orders.application.service;

import com.logipro.orders.application.dto.response.PedidoResponseDTO;
import com.logipro.orders.application.mapper.PedidoMapper;
import com.logipro.orders.application.usecase.CambiarEstadoPedidoUseCase;
import com.logipro.orders.domain.model.EstadoPedido;
import com.logipro.orders.domain.model.Pedido;
import com.logipro.orders.domain.repository.PedidoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@Transactional
@RequiredArgsConstructor
public class CambiarEstadoPedidoService implements CambiarEstadoPedidoUseCase {

    private final PedidoRepository pedidoRepository;
    private final PedidoMapper pedidoMapper;


    @Override
    public PedidoResponseDTO ejecutar(Long id, String nuevoEstado) {
        // Buscar pedido existente
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado con id:" + id));

        // Validar y convertir el estado recibido
        EstadoPedido estado;
        try {
            estado = EstadoPedido.valueOf(nuevoEstado.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Estado de pedido invalido" + nuevoEstado);
        }
        // 3. Aplicar regla de negocio (si el pedido ya está finalizado, no se cambia)
        if (pedido.getEstado() == EstadoPedido.RECIBIDO || pedido.getEstado() == EstadoPedido.CANCELADO) {
            throw new IllegalArgumentException("No se puede cambair de estado un pedido finalizado");
        }

        // Actualizar estado
        pedido.setEstado(estado);

        // Si el nuevo estado es RECIBIDO, asignar la fecha de entrega real
        if (estado == EstadoPedido.RECIBIDO) {
            pedido.setFechaEntregaReal(LocalDate.now());
        }

        // Guardar cambios
        Pedido actualizado = pedidoRepository.save(pedido);

        // retornar respuesta
        return pedidoMapper.toResponseDTO(actualizado);
    }

}
