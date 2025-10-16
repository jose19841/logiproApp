package com.logipro.inventory.application.usecase;

import com.logipro.inventory.application.dto.request.ListarInventarioRequestDTO;
import com.logipro.inventory.application.dto.response.InventarioResponseDTO;

import java.util.List;

public interface ListarInventarioUseCase {
    List<InventarioResponseDTO> ejecutar (ListarInventarioRequestDTO dto);
}
