package com.logipro.inventory.application.service;

import com.logipro.inventory.application.usecase.EliminarInventarioUseCase;
import com.logipro.inventory.domain.repository.InventarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EliminarInventarioService implements EliminarInventarioUseCase {

    private final InventarioRepository inventarioRepository;

    @Override
    @Transactional
    public void ejecutar(Long inventarioId) {
        if(inventarioId == null) throw new IllegalArgumentException("Id requerido");
        if(!inventarioRepository.existsById(inventarioId)) {
            throw new IllegalArgumentException("Inventario no encontrado");
        }
        inventarioRepository.deleteById(inventarioId);

    }
}
