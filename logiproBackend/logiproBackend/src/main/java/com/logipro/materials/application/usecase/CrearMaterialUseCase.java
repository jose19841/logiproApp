package com.logipro.materials.application.usecase;


import com.logipro.materials.application.dto.request.CrearMaterialRequestDTO;
import com.logipro.materials.application.dto.response.MaterialResponseDTO;

public interface CrearMaterialUseCase {
    MaterialResponseDTO ejecutar (CrearMaterialRequestDTO request);
}
