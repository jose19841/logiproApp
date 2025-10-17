package com.logipro.supliers.application.service;

import com.logipro.supliers.application.dto.response.ProveedorResponseDTO;
import com.logipro.supliers.application.mapper.ProveedorMapper;
import com.logipro.supliers.application.usecase.CambiarEstadoProveedorUseCase;
import com.logipro.supliers.domain.model.Proveedor;
import com.logipro.supliers.domain.repository.ProveedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * ========== SERVICE: Cambiar Estado de Proveedor ==========
 * Habilita o inhabilita un proveedor en el sistema
 */
@Service
@RequiredArgsConstructor
@Transactional
public class CambiarEstadoProveedorService implements CambiarEstadoProveedorUseCase {

    private final ProveedorRepository proveedorRepository;
    private final ProveedorMapper proveedorMapper;

    @Override
    public Optional<ProveedorResponseDTO> ejecutar(Long id, Boolean habilitar) {
        return proveedorRepository.findById(id).map(proveedor -> {
            // Aplicar la lógica de negocio del dominio
            if (habilitar) {
                proveedor.habilitar();
            } else {
                proveedor.inhabilitar();
            }

            Proveedor guardado = proveedorRepository.save(proveedor);
            return proveedorMapper.toResponseDTO(guardado);
        });
    }
}
