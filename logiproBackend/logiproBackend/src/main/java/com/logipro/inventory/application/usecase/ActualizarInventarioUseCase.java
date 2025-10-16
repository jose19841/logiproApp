package com.logipro.inventory.application.usecase;

import com.logipro.inventory.application.dto.request.ActualizarInventarioRequestDTO;
import com.logipro.inventory.application.dto.response.InventarioResponseDTO;


public interface ActualizarInventarioUseCase {
    InventarioResponseDTO ejecutar(ActualizarInventarioRequestDTO dto);
}
