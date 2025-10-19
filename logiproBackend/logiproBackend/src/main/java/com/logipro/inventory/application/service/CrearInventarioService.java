package com.logipro.inventory.application.service;

import com.logipro.inventory.application.dto.request.CrearInventarioRequestDTO;
import com.logipro.inventory.application.mapper.InventarioMapper;
import com.logipro.inventory.application.usecase.CrearInventarioUseCase;
import com.logipro.inventory.domain.model.Inventario;
import com.logipro.inventory.domain.model.Sector;
import com.logipro.inventory.domain.repository.InventarioRepository;
import com.logipro.inventory.domain.repository.SectorRepository;
import com.logipro.materials.domain.model.Material;
import com.logipro.materials.domain.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CrearInventarioService implements CrearInventarioUseCase {

    private final InventarioRepository inventarioRepository;
    private final InventarioMapper inventarioMapper;
    private final SectorRepository sectorRepository;
    private final MaterialRepository materialRepository;

    @Override
    public Inventario ejecutar(CrearInventarioRequestDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Datos requeridos");
        }

        // Resolver entidades relacionadas usando repositorios
        Sector sector = sectorRepository.findById(dto.getSectorId())
                .orElseThrow(() -> new IllegalArgumentException("Sector no encontrado: id=" + dto.getSectorId()));

        Material material = materialRepository.findById(dto.getMaterialId())
                .orElseThrow(() -> new IllegalArgumentException("Material no encontrado: id=" + dto.getMaterialId()));

        // Crear inventario y validar con métodos de negocio
        Inventario inv = inventarioMapper.fromCrearRequest(dto, sector, material);


        return inventarioRepository.save(inv);
    }
}
