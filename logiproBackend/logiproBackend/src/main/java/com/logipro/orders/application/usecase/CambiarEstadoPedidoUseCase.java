package com.logipro.orders.application.usecase;

import com.logipro.orders.application.dto.response.PedidoResponseDTO;

public interface CambiarEstadoPedidoUseCase {
    PedidoResponseDTO ejecutar(Long id, String nuevoEstado);
}
