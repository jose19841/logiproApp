package com.logipro.materials.application.service;

import com.logipro.claims.domain.model.Reclamo;
import com.logipro.claims.domain.repository.ReclamoRepository;
import com.logipro.materials.application.dto.request.ActualizarMaterialRequestDTO;
import com.logipro.materials.application.dto.response.MaterialResponseDTO;
import com.logipro.materials.application.mapper.MaterialMapper;
import com.logipro.materials.application.usecase.ActualizarMaterialUseCase;
import com.logipro.materials.domain.model.Calidad;
import com.logipro.materials.domain.model.Material;
import com.logipro.materials.domain.model.TipoMaterial;
import com.logipro.materials.domain.repository.CalidadRepository;
import com.logipro.materials.domain.repository.MaterialRepository;
import com.logipro.materials.domain.repository.TipoMaterialRepository;
import com.logipro.supliers.domain.model.Proveedor;
import com.logipro.supliers.domain.repository.ProveedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ActualizarMaterialService implements ActualizarMaterialUseCase {

    private final MaterialRepository materialRepository;
    private final MaterialMapper materialMapper;
    private final ReclamoRepository reclamoRepository;
    private final ProveedorRepository proveedorRepository;
    private final CalidadRepository calidadRepository;
    private final TipoMaterialRepository tipoMaterialRepository;

    @Override
    public MaterialResponseDTO ejecutar(Long id, ActualizarMaterialRequestDTO request) {
        // 1) Traer el material existente
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Material no encontrado: id=" + id));

        // 2) Resolver referencias por ID usando repositorios
        Reclamo reclamo = reclamoRepository.findById(request.getReclamoId())
                .orElseThrow(() -> new IllegalArgumentException("Reclamo no encontrado: id=" + request.getReclamoId()));

        Proveedor proveedor = proveedorRepository.findById(request.getProveedorId())
                .orElseThrow(() -> new IllegalArgumentException("Proveedor no encontrado: id=" + request.getProveedorId()));

        Calidad calidad = calidadRepository.findById(request.getCalidadId())
                .orElseThrow(() -> new IllegalArgumentException("Calidad no encontrada: id=" + request.getCalidadId()));

        TipoMaterial tipoMaterial = tipoMaterialRepository.findById(request.getTipoMaterialId())
                .orElseThrow(() -> new IllegalArgumentException("Tipo de material no encontrado: id=" + request.getTipoMaterialId()));

        // 3) Aplicar cambios al agregado usando métodos de negocio
        material.cambiarCantidad(request.getCantidad());
        material.actualizarRelaciones(reclamo, proveedor, calidad, tipoMaterial);

        // 4) Persistir y mapear respuesta
        Material actualizado = materialRepository.save(material);
        return materialMapper.toResponseDTO(actualizado);
    }
}
