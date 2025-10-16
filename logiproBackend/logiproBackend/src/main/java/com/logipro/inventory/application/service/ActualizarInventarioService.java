package com.logipro.inventory.application.service;

import com.logipro.inventory.application.dto.request.ActualizarInventarioRequestDTO;
import com.logipro.inventory.application.dto.response.InventarioResponseDTO;
import com.logipro.inventory.application.mapper.InventarioMapper;
import com.logipro.inventory.application.usecase.ActualizarInventarioUseCase;
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
public class ActualizarInventarioService implements ActualizarInventarioUseCase {

    private final InventarioRepository inventarioRepository;
    private final InventarioMapper inventarioMapper;
    private final SectorRepository sectorRepository;
    private final MaterialRepository materialRepository;

    @Override
    public InventarioResponseDTO ejecutar(ActualizarInventarioRequestDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Datos requeridos");
        }

        // Obtener inventario existente
        Inventario inv = inventarioRepository.findById(dto.getInventarioId())
                .orElseThrow(() -> new IllegalArgumentException("Inventario no encontrado: id=" + dto.getInventarioId()));

        // Actualizar cantidades si ambas vienen (usando método de negocio que valida)
        if (dto.getCantidadMinima() != null && dto.getCantidadMaxima() != null) {
            inv.establecerCantidades(dto.getCantidadMinima(), dto.getCantidadMaxima());
        } else if (dto.getCantidadMinima() != null || dto.getCantidadMaxima() != null) {
            // Actualización parcial: tomar valores actuales para lo que falta
            Integer min = dto.getCantidadMinima() != null ? dto.getCantidadMinima() : inv.getCantidadMinima();
            Integer max = dto.getCantidadMaxima() != null ? dto.getCantidadMaxima() : inv.getCantidadMaxima();
            inv.establecerCantidades(min, max);
        }

        // Reasignar relaciones si vienen en el DTO
        if (dto.getSectorId() != null || dto.getMaterialId() != null) {
            Sector sector = dto.getSectorId() != null
                    ? sectorRepository.findById(dto.getSectorId())
                        .orElseThrow(() -> new IllegalArgumentException("Sector no encontrado: id=" + dto.getSectorId()))
                    : inv.getSector();

            Material material = dto.getMaterialId() != null
                    ? materialRepository.findById(dto.getMaterialId())
                        .orElseThrow(() -> new IllegalArgumentException("Material no encontrado: id=" + dto.getMaterialId()))
                    : inv.getMaterial();

            inv.actualizarRelaciones(sector, material);
        }

        // Persistir y retornar
        Inventario guardado = inventarioRepository.save(inv);
        return inventarioMapper.toResponseDTO(guardado);
    }
}
