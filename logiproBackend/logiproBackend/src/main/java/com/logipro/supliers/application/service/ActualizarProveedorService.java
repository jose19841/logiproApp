package com.logipro.supliers.application.service;

import com.logipro.supliers.application.dto.request.ActualizarProveedorRequestDTO;
import com.logipro.supliers.application.dto.response.ProveedorResponseDTO;
import com.logipro.supliers.application.mapper.ProveedorMapper;
import com.logipro.supliers.application.usecase.ActualizarProveedorUseCase;
import com.logipro.supliers.domain.model.Proveedor;
import com.logipro.supliers.domain.repository.ProveedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ActualizarProveedorService implements ActualizarProveedorUseCase {

    private final ProveedorRepository proveedorRepository;
    private final ProveedorMapper proveedorMapper;

    @Override
    public Optional<ProveedorResponseDTO> ejecutar(Long id, ActualizarProveedorRequestDTO request) {
        return proveedorRepository.findById(id).map(proveedor -> {
            // Aplicar cambios solo si vienen en el request

            if (request.getNombre() != null && !request.getNombre().trim().isEmpty()) {
                proveedor.actualizarNombre(request.getNombre());
            }
            if (request.getDescripcion() != null) {
                proveedor.actualizarDescripcion(request.getDescripcion());
            }
            if (request.getDireccion() != null) {
                proveedor.actualizarDireccion(request.getDireccion());
            }
            if (request.getTelefono() != null) {
                proveedor.actualizarTelefono(request.getTelefono());
            }

            Proveedor guardado = proveedorRepository.save(proveedor);
            return proveedorMapper.toResponseDTO(guardado);
        });
    }
}