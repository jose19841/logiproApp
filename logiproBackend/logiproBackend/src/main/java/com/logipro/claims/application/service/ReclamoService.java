package com.logipro.claims.application.service;

import com.logipro.claims.application.dto.request.CambiarEstadoReclamoRequestDTO;
import com.logipro.claims.application.dto.request.CrearReclamoRequestDTO;
import com.logipro.claims.application.dto.response.ReclamoResponseDTO;
import com.logipro.claims.application.mapper.ReclamoMapper;
import com.logipro.claims.application.usecase.CambiarEstadoReclamoUseCase;
import com.logipro.claims.application.usecase.CrearReclamoUseCase;
import com.logipro.claims.domain.model.EstadoReclamo;
import com.logipro.claims.domain.model.Reclamo;
import com.logipro.claims.domain.repository.ReclamoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReclamoService {
    private final CrearReclamoUseCase crearReclamoUseCase;
    private final ReclamoRepository reclamoRepository;
    private final ReclamoMapper reclamoMapper;
    private final CambiarEstadoReclamoUseCase cambiarEstadoReclamoUseCase;

    /**
     * Alta de reclamo vía use case
     */
    @Transactional
    public ReclamoResponseDTO crear(CrearReclamoRequestDTO dto) {
        return crearReclamoUseCase.ejecutar(dto);
    }

    /**
     * Buscar por ID (lectura simple)
     */
    @Transactional(readOnly = true)
    public Optional<ReclamoResponseDTO> buscarPorId(Long id) {
        return reclamoRepository.findById(id)
                .map(reclamoMapper::toResponseDTO);
    }

    /**
     * Buscar por número de reclamo
     */
    @Transactional(readOnly = true)
    public Optional<ReclamoResponseDTO> buscarPorNumero(String numReclamo) {
        return reclamoRepository.findByNumReclamo(numReclamo.trim())
                .map(reclamoMapper::toResponseDTO);
    }

    /**
     * Listar todos ordenados por numReclamo ASC
     */
    @Transactional(readOnly = true)
    public List<ReclamoResponseDTO> listar() {
        List<Reclamo> lista = reclamoRepository.findAll(Sort.by(Sort.Direction.ASC, "numReclamo"));
        return reclamoMapper.toResponseDTOList(lista);
    }

    /**
     * Listar por estado (PENDIENTE, EN_PROCESO, RESUELTO, CERRADO)
     */
    @Transactional(readOnly = true)
    public List<ReclamoResponseDTO> listarPorEstado(EstadoReclamo estado) {
        List<Reclamo> lista = reclamoRepository.findByEstado(estado);
        return reclamoMapper.toResponseDTOList(lista);
    }

    /* === Cambiar estado (delegado a use case) === */
    @Transactional
    public Optional<ReclamoResponseDTO> cambiarEstado(Long idReclamo, CambiarEstadoReclamoRequestDTO dto) {
        return cambiarEstadoReclamoUseCase.ejecutar(idReclamo, dto);
    }

    /* === Listar Ordenado === */
    @Transactional(readOnly = true)
    public List<ReclamoResponseDTO> listarOrdenadoPorNumeroASC() {
        List<Reclamo> reclamos = reclamoRepository.findAll(Sort.by(Sort.Direction.ASC, "numReclamo"));
        return reclamoMapper.toResponseDTOList(reclamos);
    }
}