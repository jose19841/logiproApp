package com.logipro.materials.application.service;

import com.logipro.claims.domain.model.Reclamo;
import com.logipro.materials.application.dto.request.CrearMaterialRequestDTO;
import com.logipro.materials.application.dto.response.MaterialResponseDTO;
import com.logipro.materials.application.mapper.MaterialMapper;
import com.logipro.materials.application.usecase.CrearMaterialUseCase;
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
public class CrearMaterialService implements CrearMaterialUseCase {

    private final MaterialRepository materialRepository;
    private final MaterialMapper materialMapper;
    private final EntityManager em;

    // Resolver entidades relacionadas por ID.
    // Usamos EntityManager para evitar repositorios adicionales y mantener el agregado centrado en Material.

    @Override
    public MaterialResponseDTO ejecutar(CrearMaterialRequestDTO request) {
        Reclamo reclamo = em.find(Reclamo.class, request.getReclamoId());
        if(reclamo==null) {
            throw new IllegalArgumentException("Reclamo no encontrado: id=" + request.getReclamoId());

        }
        Proveedor proveedor = em.find(Proveedor.class, request.getProveedorId());
        if(proveedor==null) {
            throw new IllegalArgumentException("Proveedor no encontrado: id=" + request.getProveedorId());
        }

        Calidad calidad = em.find(Calidad.class, request.getCalidadId());
            if(calidad == null) {
                throw new IllegalArgumentException("calidad no encontrada: id=" + request.getCalidadId());
            }

             TipoMaterial tipoMaterial = em.find(TipoMaterial.class, request.getTipoMaterialId());
            if (tipoMaterial== null) {
                throw new IllegalArgumentException("Tipo de material no encontrado: id=" + request.getTipoMaterialId());
            }
            // Componer el agregado y persistir
            Material material = materialMapper.toEntity(request, reclamo, proveedor, calidad, tipoMaterial);
            Material guardado= materialRepository.save(material);

            // respuesta
            return materialMapper.toResponseDTO(guardado);
        }
    }

