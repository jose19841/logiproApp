package com.logipro.materials.application.service;

import com.logipro.materials.application.dto.request.ActualizarMaterialRequestDTO;
import com.logipro.materials.application.dto.request.CrearMaterialRequestDTO;
import com.logipro.materials.application.dto.request.FiltroMaterialesDTO;
import com.logipro.materials.application.dto.response.MaterialResponseDTO;
import com.logipro.materials.application.mapper.MaterialMapper;
import com.logipro.materials.application.usecase.*;
import com.logipro.materials.domain.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MaterialService {

    private final CrearMaterialUseCase crearMaterialUseCase;
    private final ActualizarMaterialUseCase actualizarMaterialUseCase;
    private final EliminarMaterialUseCase eliminarMaterialUseCase;
    private final ObtenerMaterialPorIdUseCase obtenerMaterialPorIdUseCase;
    private final ListarMaterialesUseCase listarMaterialesUseCase;
    private final MaterialRepository materialRepository;
    private final MaterialMapper materialMapper;

    @Transactional
    public MaterialResponseDTO crear(CrearMaterialRequestDTO dto) {
        return crearMaterialUseCase.ejecutar(dto);
    }

    @Transactional(readOnly = true)
    public Optional<MaterialResponseDTO> buscarPorId(Long id) {
        return Optional.ofNullable(obtenerMaterialPorIdUseCase.ejecutar(id));
    }

    @Transactional(readOnly = true)
    public List<MaterialResponseDTO> listar(FiltroMaterialesDTO filtro, int page, int size, String sortBy, String sortDir) {
        return listarMaterialesUseCase.ejecutar(filtro, page, size, sortBy, sortDir);
    }

    @Transactional
    public MaterialResponseDTO actualizar(Long id, ActualizarMaterialRequestDTO dto) {
        return actualizarMaterialUseCase.ejecutar(id, dto);
    }

    @Transactional
    public void eliminar(Long id) {
        eliminarMaterialUseCase.ejecutar(id);
    }
}

