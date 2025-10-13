package com.logipro.claims.application.usecase;

import com.logipro.claims.application.dto.request.CrearReclamoRequestDTO;
import com.logipro.claims.application.dto.response.ReclamoResponseDTO;

public interface CrearReclamoUseCase {
    ReclamoResponseDTO ejecutar (CrearReclamoRequestDTO request);
}
