package com.logipro.orders.application.usecase;

import com.logipro.orders.application.dto.request.FiltroPedidosRequestDTO;
import com.logipro.orders.application.dto.response.PedidoResponseDTO;

import java.util.List;

public interface ListarPedidosUseCase {
    List<PedidoResponseDTO> ejecutar(FiltroPedidosRequestDTO filtros, int page, int size, String sortBy, String sortDir);
}
