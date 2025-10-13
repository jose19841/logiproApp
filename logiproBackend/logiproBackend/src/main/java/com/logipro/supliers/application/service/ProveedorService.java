package com.logipro.supliers.application.service;

import com.logipro.supliers.application.dto.request.ActualizarProveedorRequestDTO;
import com.logipro.supliers.application.dto.request.CrearProveedorRequestDTO;
import com.logipro.supliers.application.dto.response.ProveedorResponseDTO;
import com.logipro.supliers.application.mapper.ProveedorMapper;
import com.logipro.supliers.application.usecase.ActualizarProveedorUseCase;
import com.logipro.supliers.application.usecase.CrearProveedorUseCase;
import com.logipro.supliers.application.usecase.ListarProveedoresUseCase;
import com.logipro.supliers.domain.repository.ProveedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProveedorService {
    private final CrearProveedorUseCase crearProveedorUseCase;
    private final ListarProveedoresUseCase listarProveedoresUseCase;
    private final ProveedorRepository proveedorRepository;
    private final ProveedorMapper proveedorMapper;
    private final ActualizarProveedorUseCase actualizarProveedorUseCase;

    // Ata proveedor via UseCase

    @Transactional
    public ProveedorResponseDTO crear(CrearProveedorRequestDTO dto){
        return crearProveedorUseCase.ejecutar(dto);
    }

    // busqueda de Proovedor por id usando repo + mapper

    public Optional<ProveedorResponseDTO> buscar (Long id){
        return proveedorRepository.findById(id)
                .map(proveedorMapper::toResponseDTO);

    }
    // listado via UseCase

    public List<ProveedorResponseDTO> listar(){
        return listarProveedoresUseCase.ejecutar();
    }
    // === Actualización parcial ===
    @Transactional
    public Optional<ProveedorResponseDTO> actualizar(Long id, ActualizarProveedorRequestDTO dto) {
        return actualizarProveedorUseCase.ejecutar(id, dto);
    }

}
