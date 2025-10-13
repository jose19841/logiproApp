package com.logipro.materials.application.usecase;

import com.logipro.materials.application.dto.request.FiltroMaterialesDTO;
import com.logipro.materials.application.dto.response.MaterialResponseDTO;

import java.util.List;

public interface ListarMaterialesUseCase {
    List<MaterialResponseDTO> ejecutar(FiltroMaterialesDTO filtro, int page, int size, String sortBy, String sortDir );
}
