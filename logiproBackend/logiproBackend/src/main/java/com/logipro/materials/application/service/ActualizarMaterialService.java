package com.logipro.materials.application.service;

import com.logipro.claims.domain.model.Reclamo;
import com.logipro.claims.domain.repository.ReclamoRepository;
import com.logipro.materials.application.dto.request.ActualizarMaterialRequestDTO;
import com.logipro.materials.application.dto.response.MaterialResponseDTO;
import com.logipro.materials.application.mapper.MaterialMapper;
import com.logipro.materials.application.usecase.ActualizarMaterialUseCase;
import com.logipro.materials.domain.model.Calidad;
import com.logipro.materials.domain.model.DetalleCalidad;
import com.logipro.materials.domain.model.Material;
import com.logipro.materials.domain.model.TipoMaterial;
import com.logipro.materials.domain.repository.CalidadRepository;
import com.logipro.materials.domain.repository.DetalleCalidadRepository;
import com.logipro.materials.domain.repository.MaterialRepository;
import com.logipro.materials.domain.repository.TipoMaterialRepository;
import com.logipro.supliers.domain.model.Proveedor;
import com.logipro.supliers.domain.repository.ProveedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Transactional
public class ActualizarMaterialService implements ActualizarMaterialUseCase {

    private final MaterialRepository materialRepository;
    private final MaterialMapper materialMapper;
    private final ReclamoRepository reclamoRepository;
    private final ProveedorRepository proveedorRepository;
    private final CalidadRepository calidadRepository;
    private final DetalleCalidadRepository detalleCalidadRepository;
    private final TipoMaterialRepository tipoMaterialRepository;

    @Override
    public MaterialResponseDTO ejecutar(Long id, ActualizarMaterialRequestDTO request) {
        // 1. Traer el material existente
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Material no encontrado: id=" + id));

        // 2. Resolver proveedor y tipo material
        Proveedor proveedor = proveedorRepository.findById(request.getProveedorId())
                .orElseThrow(() -> new IllegalArgumentException("Proveedor no encontrado: id=" + request.getProveedorId()));

        TipoMaterial tipoMaterial = tipoMaterialRepository.findById(request.getTipoMaterialId())
                .orElseThrow(() -> new IllegalArgumentException("Tipo de material no encontrado: id=" + request.getTipoMaterialId()));

        // 3. Resolver reclamo (opcional)
        Reclamo reclamo = null;
        if (request.getReclamoId() != null) {
            reclamo = reclamoRepository.findById(request.getReclamoId())
                    .orElseThrow(() -> new IllegalArgumentException("Reclamo no encontrado: id=" + request.getReclamoId()));
        }

        // 4. Actualizar inspección (crear nueva DetalleCalidad + Calidad)
        DetalleCalidad detalleCalidad = DetalleCalidad.builder()
                .resultado(request.getResultadoInspeccion())
                .observaciones(request.getObservacionesInspeccion())
                .build();
        detalleCalidadRepository.save(detalleCalidad);

        Calidad calidad = Calidad.builder()
                .fechaInspeccion(Instant.now())
                .detalleCalidad(detalleCalidad)
                .build();
        calidadRepository.save(calidad);

        // 5. Aplicar cambios al material usando métodos de negocio
        material.cambiarCantidad(request.getCantidad());
        material.actualizarRelaciones(reclamo, proveedor, calidad, tipoMaterial);

        // 6. Persistir y mapear respuesta
        Material actualizado = materialRepository.save(material);
        return materialMapper.toResponseDTO(actualizado);
    }
}
