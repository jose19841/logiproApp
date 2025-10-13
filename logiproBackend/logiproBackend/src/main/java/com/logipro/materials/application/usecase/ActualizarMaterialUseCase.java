package com.logipro.materials.application.usecase;

import com.logipro.materials.application.dto.request.ActualizarMaterialRequestDTO;
import com.logipro.materials.application.dto.response.MaterialResponseDTO;

public interface ActualizarMaterialUseCase {
    MaterialResponseDTO ejecutar(Long id, ActualizarMaterialRequestDTO request);
}
