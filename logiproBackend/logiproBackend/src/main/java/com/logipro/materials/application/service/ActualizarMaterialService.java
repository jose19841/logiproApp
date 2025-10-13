package com.logipro.materials.application.service;

import com.logipro.claims.domain.model.Reclamo;
import com.logipro.materials.application.dto.request.ActualizarMaterialRequestDTO;
import com.logipro.materials.application.dto.response.MaterialResponseDTO;
import com.logipro.materials.application.mapper.MaterialMapper;
import com.logipro.materials.application.usecase.ActualizarMaterialUseCase;
import com.logipro.materials.domain.model.Calidad;
import com.logipro.materials.domain.model.Material;
import com.logipro.materials.domain.model.TipoMaterial;
import com.logipro.materials.domain.repository.MaterialRepository;
import com.logipro.supliers.domain.model.Proveedor;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional

public class ActualizarMaterialService implements ActualizarMaterialUseCase {

    private final MaterialRepository materialRepository;
    private final MaterialMapper materialMapper;
    private final EntityManager em;

    @Override
    public MaterialResponseDTO ejecutar(Long id, ActualizarMaterialRequestDTO request) {
        // 1) Traer el material existente
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Material no encontrado: id=" + id));

        // 2) Resolver referencias por ID (reclamo, proveedor, calidad, tipo)
        Reclamo reclamo = em.find(Reclamo.class, request.getReclamoId());
        if(reclamo == null) throw new IllegalArgumentException("Reclamo no encontrado: id=" + request.getReclamoId());

        Proveedor proveedor = em.find(Proveedor.class, request.getProveedorId());
        if(proveedor == null) throw new IllegalArgumentException("Proveedor no encontrado: id=" + request.getProveedorId());

        Calidad calidad = em.find(Calidad.class, request.getCalidadId());
        if(calidad == null) throw new IllegalArgumentException("Calidad no encontrada: id" + request.getCalidadId());

        TipoMaterial tipoMaterial= em.find(TipoMaterial.class, request.getTipoMaterialId());
        if(tipoMaterial == null) throw new IllegalArgumentException("Tipo de material no encontrado: id" + request.getTipoMaterialId());

        // 3) Aplicar cambios al agregado

        material.setCantidad(request.getCantidad());
        material.setReclamo(reclamo);
        material.setProveedor(proveedor);
        material.setCalidad(calidad);
        material.setTipoMaterial(tipoMaterial);

        // 4) Persistir y mapear respuesta

        Material actualizado=materialRepository.save(material);
        return materialMapper.toResponseDTO(actualizado);
    }
}
