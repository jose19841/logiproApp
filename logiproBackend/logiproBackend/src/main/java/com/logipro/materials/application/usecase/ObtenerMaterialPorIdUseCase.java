package com.logipro.materials.application.usecase;

import com.logipro.materials.application.dto.response.MaterialResponseDTO;

public interface ObtenerMaterialPorIdUseCase {
    MaterialResponseDTO ejecutar(Long id);
}
