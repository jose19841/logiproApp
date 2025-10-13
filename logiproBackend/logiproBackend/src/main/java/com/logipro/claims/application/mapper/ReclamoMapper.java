package com.logipro.claims.application.mapper;

import com.logipro.claims.application.dto.response.ReclamoResponseDTO;
import com.logipro.claims.domain.model.Reclamo;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ReclamoMapper {

    public ReclamoResponseDTO toResponseDTO(Reclamo reclamo){
        if (reclamo==null) return null;

        return ReclamoResponseDTO.builder()
                .id(reclamo.getId())
                .numReclamo(reclamo.getNumReclamo())
                .descripcion(reclamo.getDescripcion())
                .estado(reclamo.getEstado().name())
                .detalleReclamoId(
                        reclamo.getDetalleReclamo() !=null
                        ? reclamo.getDetalleReclamo().getId()
                                : null
                )
                .proveedorId(reclamo.getProveedor().getId())
                .proveedorNombre(reclamo.getProveedor().getNombre())
                .proveedorDescripcion(reclamo.getProveedor().getDescripcion())
                .build();

    }
    public List<ReclamoResponseDTO> toResponseDTOList(List<Reclamo> reclamos){
        if(reclamos==null || reclamos.isEmpty()) return List.of();
        return reclamos.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }
}
