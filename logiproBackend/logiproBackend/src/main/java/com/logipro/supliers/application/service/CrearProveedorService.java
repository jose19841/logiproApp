package com.logipro.supliers.application.service;

import com.logipro.supliers.application.dto.request.CrearProveedorRequestDTO;
import com.logipro.supliers.application.dto.response.ProveedorResponseDTO;
import com.logipro.supliers.application.mapper.ProveedorMapper;
import com.logipro.supliers.application.usecase.CrearProveedorUseCase;
import com.logipro.supliers.domain.model.Proveedor;
import com.logipro.supliers.domain.repository.ProveedorRepository;
import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * ========== IMPLEMENTACIÓN: Crear Proveedor ==========
 */
@Service
@Transactional
@AllArgsConstructor

public class CrearProveedorService implements CrearProveedorUseCase {

    private final ProveedorRepository proveedorRepository;
    private final ProveedorMapper proveedorMapper;


    @Override
    public ProveedorResponseDTO ejecutar(CrearProveedorRequestDTO request) {
        // El constructor ya hace trim y validaciones
        Proveedor proveedor = new Proveedor(
            request.getNombre(),
            request.getDescripcion(),
            request.getDireccion(),
            request.getTelefono()
        );
        Proveedor guardado = proveedorRepository.save(proveedor);

        return proveedorMapper.toResponseDTO(guardado);
    }
}
