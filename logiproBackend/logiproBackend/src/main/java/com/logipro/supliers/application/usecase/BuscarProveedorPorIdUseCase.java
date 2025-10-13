package com.logipro.supliers.application.usecase;

import com.logipro.supliers.application.dto.response.ProveedorResponseDTO;

import java.util.Optional;

public interface BuscarProveedorPorIdUseCase {
    Optional<ProveedorResponseDTO> ejecutar(Long id);
}
