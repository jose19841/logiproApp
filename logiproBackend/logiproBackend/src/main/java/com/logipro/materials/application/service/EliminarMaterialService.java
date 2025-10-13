package com.logipro.materials.application.service;

import com.logipro.materials.application.usecase.EliminarMaterialUseCase;
import com.logipro.materials.domain.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class EliminarMaterialService implements EliminarMaterialUseCase {

    private final MaterialRepository materialRepository;

    @Override
    public void ejecutar(Long id) {
        if(!materialRepository.existsById(id)){
            throw new IllegalArgumentException("Material no encontrado: id=" + id);
        }
        materialRepository.deleteById(id);
    }
}
