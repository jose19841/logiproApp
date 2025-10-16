package com.logipro.materials.application.mapper;

import com.logipro.claims.domain.model.Reclamo;
import com.logipro.materials.application.dto.request.CrearMaterialRequestDTO;
import com.logipro.materials.application.dto.response.MaterialResponseDTO;
import com.logipro.materials.domain.model.Calidad;
import com.logipro.materials.domain.model.Material;
import com.logipro.materials.domain.model.TipoMaterial;
import com.logipro.supliers.domain.model.Proveedor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class MaterialMapper {

    // ===== ENTITY → RESPONSE DTO =====

    public MaterialResponseDTO toResponseDTO(Material material){
        if(material == null) return null;

        return MaterialResponseDTO.builder()
                .id(material.getId())
                .cantidad(material.getCantidad())

                .reclamoId(material.getReclamo() != null ? material.getReclamo().getId() : null)
                .reclamoDescripcion(material.getReclamo() != null ? material.getReclamo().getDescripcion():null)

                .proveedorId(material.getProveedor() != null ? material.getProveedor().getId(): null)
                .proveedorDescripcion(material.getProveedor() != null ? material.getProveedor().getDescripcion(): null)

                .calidadId(material.getCalidad() != null ? material.getCalidad().getId() : null)
                .resultadoCalidad(material.getCalidad() != null && material.getCalidad().getDetalleCalidad() != null
                    ? material.getCalidad().getDetalleCalidad().getResultado() : null)

                .tipoMaterialId(material.getTipoMaterial() != null ?material.getTipoMaterial().getId() : null)
                .nombreTipoMaterial(material.getTipoMaterial() != null ? material.getTipoMaterial().getNombre() : null)
                .build();

    }
    public List<MaterialResponseDTO> toResponseList(List<Material> materiales) {
        return materiales.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // ===== REQUEST DTO → ENTITY parcial =====
    // (solo para componer dentro del caso de uso)

    public Material toEntity(
            CrearMaterialRequestDTO dto,
            Reclamo reclamo,
            Proveedor proveedor,
            Calidad calidad,
            TipoMaterial tipoMaterial

    ) {
         return Material.builder()
                 .cantidad(dto.getCantidad())
                 .reclamo(reclamo)
                 .proveedor(proveedor)
                 .calidad(calidad)
                 .tipoMaterial(tipoMaterial)
                 .build();
    }

}
