package com.logipro.supliers.application.mapper;

import com.logipro.supliers.application.dto.response.ProveedorResponseDTO;
import com.logipro.supliers.domain.model.Proveedor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * ========== MAPPER: Proveedor → DTOs ==========
 */
@Component
public class ProveedorMapper {

    public ProveedorResponseDTO toResponseDTO(Proveedor proveedor){
        if(proveedor == null) return null;
        return ProveedorResponseDTO.builder()
                .id(proveedor.getId())
                .nombre(proveedor.getNombre())
                .descripcion(proveedor.getDescripcion())
                .build();
    }
    public List<ProveedorResponseDTO> toResponseDTOList(List<Proveedor> proveedores){
        if(proveedores==null) return List.of();

        return proveedores.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }
}
