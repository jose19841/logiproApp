package com.logipro.claims.application.service;

import com.logipro.claims.application.dto.response.ReclamoResponseDTO;
import com.logipro.claims.application.mapper.ReclamoMapper;
import com.logipro.claims.application.usecase.ListarReclamosPorEstadoUseCase;
import com.logipro.claims.application.usecase.ListarReclamosUseCase;
import com.logipro.claims.domain.model.EstadoReclamo;
import com.logipro.claims.domain.model.Reclamo;
import com.logipro.claims.domain.repository.ReclamoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ListarReclamosPorEstadoService implements ListarReclamosPorEstadoUseCase {

    private final ReclamoRepository reclamoRepository;
    private final ReclamoMapper reclamoMapper;

    @Override
    public List<ReclamoResponseDTO> ejecutar(EstadoReclamo estado) {
        List<Reclamo> lista = reclamoRepository.findByEstado(estado);
        return reclamoMapper.toResponseDTOList(lista);
    }
}
