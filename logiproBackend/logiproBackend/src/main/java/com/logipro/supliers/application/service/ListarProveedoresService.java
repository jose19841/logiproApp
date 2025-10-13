package com.logipro.supliers.application.service;

import com.logipro.supliers.application.dto.response.ProveedorResponseDTO;
import com.logipro.supliers.application.mapper.ProveedorMapper;
import com.logipro.supliers.application.usecase.ListarProveedoresUseCase;
import com.logipro.supliers.domain.model.Proveedor;
import com.logipro.supliers.domain.repository.ProveedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ListarProveedoresService implements ListarProveedoresUseCase {
    private final ProveedorRepository proveedorRepository;
    private final ProveedorMapper proveedorMapper;


    @Override
    public List<ProveedorResponseDTO> ejecutar() {
        List<Proveedor> proveedores = proveedorRepository.findAll(Sort.by(Sort.Direction.ASC, "Nombre"));
        return proveedorMapper.toResponseDTOList(proveedores);
    }
}
