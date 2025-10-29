package com.logipro.orders.application.usecase;

import com.logipro.orders.application.dto.response.PedidoResponseDTO;

import java.util.Optional;

public interface ObtenerPedidoPorIdUseCase {
    Optional<PedidoResponseDTO> ejecutar(Long id);
}
