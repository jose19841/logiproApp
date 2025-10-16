package com.logipro.inventory.application.service;

import com.logipro.inventory.application.dto.response.InventarioResponseDTO;
import com.logipro.inventory.application.mapper.InventarioMapper;
import com.logipro.inventory.application.usecase.ObtenerInventarioUseCase;
import com.logipro.inventory.domain.model.Inventario;
import com.logipro.inventory.domain.repository.InventarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ObtenerInventarioService implements ObtenerInventarioUseCase {

    private final InventarioRepository inventarioRepository;
    private final InventarioMapper inventarioMapper;

    @Override
    @Transactional(readOnly = true)
    public InventarioResponseDTO ejecutar(Long inventarioId) {
        Optional<Inventario> opt = inventarioRepository.findById(inventarioId);
        Inventario inv = opt.orElseThrow(() -> new IllegalArgumentException("Inventario no encontrado"));
        return inventarioMapper.toResponseDTO(inv);

    }
}
