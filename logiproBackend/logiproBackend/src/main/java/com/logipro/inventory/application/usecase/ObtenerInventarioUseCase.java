package com.logipro.inventory.application.usecase;


import com.logipro.inventory.application.dto.response.InventarioResponseDTO;

public interface ObtenerInventarioUseCase {
    InventarioResponseDTO ejecutar(Long inventarioId);
}
