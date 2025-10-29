package com.logipro.orders.application.usecase;

import com.logipro.orders.application.dto.request.CrearPedidoRequestDTO;
import com.logipro.orders.application.dto.response.PedidoResponseDTO;

public interface CrearPedidoUseCase {

    PedidoResponseDTO ejecutar(CrearPedidoRequestDTO request);
}
