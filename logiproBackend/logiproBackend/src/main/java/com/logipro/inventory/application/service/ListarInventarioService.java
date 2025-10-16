package com.logipro.inventory.application.service;

import com.logipro.inventory.application.dto.request.ListarInventarioRequestDTO;
import com.logipro.inventory.application.dto.response.InventarioResponseDTO;
import com.logipro.inventory.application.mapper.InventarioMapper;
import com.logipro.inventory.application.usecase.ListarInventarioUseCase;
import com.logipro.inventory.domain.model.Inventario;
import com.logipro.inventory.domain.repository.InventarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ListarInventarioService implements ListarInventarioUseCase {

    private final InventarioRepository inventarioRepository;
    private final InventarioMapper inventarioMapper;

    @Override
    @Transactional(readOnly = true)
    public List<InventarioResponseDTO> ejecutar(ListarInventarioRequestDTO dto) {
        List<Inventario> base;

        // filtros
        if (dto.getSectorId() != null && dto.getMaterialId() != null) {
            base = inventarioRepository.findBySector_Id(dto.getSectorId())
                    .stream()
                    .filter(i -> i.getMaterial() != null && i.getMaterial().getId().equals(dto.getMaterialId()))
                    .toList();

        } else if (dto.getSectorId() != null) {
            base = inventarioRepository.findBySector_Id(dto.getSectorId());

        } else if (dto.getMaterialId() != null) {
            base = inventarioRepository.findByMaterial_Id(dto.getMaterialId());

        } else {
            base = inventarioRepository.findAll();
        }

        // orden estable por id
        base = base.stream()
                .sorted(Comparator.comparing(Inventario::getId))
                .toList();

        // aplicar inicio/limite en memoria
        int from = Math.max(0, dto.getInicio());
        int to = Math.min(base.size(), from + dto.getLimite());
        List<Inventario> ventana = (from >= to) ? List.of() : base.subList(from, to);

        return ventana.stream().map(inventarioMapper::toResponseDTO).toList();
    }
}

