package com.logipro.claims.application.service;

import com.logipro.claims.application.dto.response.ReclamoResponseDTO;
import com.logipro.claims.application.mapper.ReclamoMapper;
import com.logipro.claims.application.usecase.BuscarReclamoPorIdUseCase;
import com.logipro.claims.domain.repository.ReclamoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BuscarReclamoPorIdService implements BuscarReclamoPorIdUseCase {

    private final ReclamoRepository reclamoRepository;
    private final ReclamoMapper reclamoMapper;

    @Override
    public Optional<ReclamoResponseDTO> ejecutar(Long id) {
        return reclamoRepository.findById(id)
                .map(reclamoMapper::toResponseDTO);
    }
}
