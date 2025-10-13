package com.logipro.claims.application.usecase;

import com.logipro.claims.application.dto.response.ReclamoResponseDTO;

import java.util.List;

public interface ListarReclamosUseCase {
    List<ReclamoResponseDTO> ejecutar();
}
