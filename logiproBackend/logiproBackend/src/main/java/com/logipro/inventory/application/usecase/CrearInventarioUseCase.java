package com.logipro.inventory.application.usecase;

import com.logipro.inventory.application.dto.request.CrearInventarioRequestDTO;
import com.logipro.inventory.domain.model.Inventario;

public interface CrearInventarioUseCase {

    Inventario ejecutar(CrearInventarioRequestDTO dto);
}
