package com.logipro.claims.application.usecase;

import com.logipro.claims.application.dto.request.CambiarEstadoReclamoRequestDTO;
import com.logipro.claims.application.dto.response.ReclamoResponseDTO;

import java.util.Optional;

public interface CambiarEstadoReclamoUseCase {
    Optional <ReclamoResponseDTO> ejecutar (Long idReclamo, CambiarEstadoReclamoRequestDTO request);
}
