package com.logipro.claims.application.service;

import com.logipro.claims.application.dto.response.ReclamoResponseDTO;
import com.logipro.claims.application.mapper.ReclamoMapper;
import com.logipro.claims.application.usecase.ListarReclamosUseCase;
import com.logipro.claims.domain.model.Reclamo;
import com.logipro.claims.domain.repository.ReclamoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ListarReclamosService implements ListarReclamosUseCase {
    private final ReclamoRepository reclamoRepository;
    private final ReclamoMapper reclamoMapper;

    @Override
    public List<ReclamoResponseDTO> ejecutar() {
        List<Reclamo> reclamos = reclamoRepository.findAll(
                Sort.by(Sort.Direction.ASC, "numReclamo")
        );
        return reclamoMapper.toResponseDTOList(reclamos);
    }
}
