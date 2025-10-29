package com.logipro.orders.application.usecase;

import com.logipro.orders.application.dto.request.ActualizarPedidoRequestDTO;
import com.logipro.orders.application.dto.response.PedidoResponseDTO;

public interface ActualizarPedidoUseCase {
    PedidoResponseDTO ejecutar(Long id, ActualizarPedidoRequestDTO request);
}
