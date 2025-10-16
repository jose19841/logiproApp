package com.logipro.claims.application.service;

import com.logipro.claims.application.dto.request.CambiarEstadoReclamoRequestDTO;
import com.logipro.claims.application.dto.request.CrearReclamoRequestDTO;
import com.logipro.claims.application.dto.response.ReclamoResponseDTO;
import com.logipro.claims.application.usecase.BuscarReclamoPorIdUseCase;
import com.logipro.claims.application.usecase.CambiarEstadoReclamoUseCase;
import com.logipro.claims.application.usecase.CrearReclamoUseCase;
import com.logipro.claims.application.usecase.ListarReclamosUseCase;
import com.logipro.claims.application.usecase.ListarReclamosPorEstadoUseCase;
import com.logipro.claims.domain.model.EstadoReclamo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReclamoService {
    private final CrearReclamoUseCase crearReclamoUseCase;
    private final BuscarReclamoPorIdUseCase buscarReclamoPorIdUseCase;
    private final ListarReclamosUseCase listarReclamosUseCase;
    private final ListarReclamosPorEstadoUseCase listarReclamosPorEstadoUseCase;
    private final CambiarEstadoReclamoUseCase cambiarEstadoReclamoUseCase;

    @Transactional
    public ReclamoResponseDTO crear(CrearReclamoRequestDTO dto) {
        return crearReclamoUseCase.ejecutar(dto);
    }

    @Transactional(readOnly = true)
    public Optional<ReclamoResponseDTO> buscarPorId(Long id) {
        return buscarReclamoPorIdUseCase.ejecutar(id);
    }

    @Transactional(readOnly = true)
    public List<ReclamoResponseDTO> listar() {
        return listarReclamosUseCase.ejecutar();
    }

    @Transactional(readOnly = true)
    public List<ReclamoResponseDTO> listarPorEstado(EstadoReclamo estado) {
        return listarReclamosPorEstadoUseCase.ejecutar(estado);
    }

    @Transactional
    public Optional<ReclamoResponseDTO> cambiarEstado(Long idReclamo, CambiarEstadoReclamoRequestDTO dto) {
        return cambiarEstadoReclamoUseCase.ejecutar(idReclamo, dto);
    }
}