package com.logipro.supliers.application.service;

import com.logipro.supliers.application.dto.response.ProveedorResponseDTO;
import com.logipro.supliers.application.mapper.ProveedorMapper;
import com.logipro.supliers.application.usecase.BuscarProveedorPorIdUseCase;
import com.logipro.supliers.domain.repository.ProveedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BuscarProveedorPorIdService implements BuscarProveedorPorIdUseCase {

    private final ProveedorRepository proveedorRepository;
    private final ProveedorMapper proveedorMapper;

    @Override
    public Optional<ProveedorResponseDTO> ejecutar(Long id) {
        return proveedorRepository.findById(id)
                .map(proveedorMapper::toResponseDTO);
    }
}
