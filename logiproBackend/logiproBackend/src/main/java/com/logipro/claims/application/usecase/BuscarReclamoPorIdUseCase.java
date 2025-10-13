package com.logipro.claims.application.usecase;

import com.logipro.claims.application.dto.response.ReclamoResponseDTO;

import java.util.Optional;

public interface BuscarReclamoPorIdUseCase {
    Optional<ReclamoResponseDTO> ejecutar(Long id);
}
