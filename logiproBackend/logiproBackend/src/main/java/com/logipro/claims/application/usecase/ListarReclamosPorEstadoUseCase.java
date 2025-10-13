package com.logipro.claims.application.usecase;

import com.logipro.claims.application.dto.response.ReclamoResponseDTO;
import com.logipro.claims.domain.model.EstadoReclamo;

import java.util.List;

public interface ListarReclamosPorEstadoUseCase {
    List<ReclamoResponseDTO> ejecutar(EstadoReclamo estado);
}
