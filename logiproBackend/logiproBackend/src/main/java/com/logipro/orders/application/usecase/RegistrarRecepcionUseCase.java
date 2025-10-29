package com.logipro.orders.application.usecase;

import com.logipro.orders.application.dto.request.RegistrarRecepcionRequestDTO;
import com.logipro.orders.application.dto.response.PedidoResponseDTO;

public interface RegistrarRecepcionUseCase {
    PedidoResponseDTO ejecutar(RegistrarRecepcionRequestDTO request);
}
