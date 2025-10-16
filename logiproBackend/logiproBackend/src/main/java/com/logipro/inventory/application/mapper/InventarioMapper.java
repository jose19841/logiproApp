package com.logipro.inventory.application.mapper;

import com.logipro.inventory.application.dto.request.CrearInventarioRequestDTO;
import com.logipro.inventory.application.dto.response.InventarioResponseDTO;
import com.logipro.inventory.domain.model.Inventario;
import com.logipro.inventory.domain.model.Sector;
import com.logipro.materials.domain.model.Material;
import org.springframework.stereotype.Component;

@Component
public class InventarioMapper {

    // Entrada → Entidad (usando métodos de negocio)
    public Inventario fromCrearRequest(CrearInventarioRequestDTO dto, Sector sector, Material material) {
        Inventario inventario = new Inventario();

        // Usar métodos de negocio que validan las reglas de dominio
        inventario.establecerCantidades(dto.getCantidadMinima(), dto.getCantidadMaxima());
        inventario.actualizarRelaciones(sector, material);

        return inventario;
    }
    // Entidad -> salida
    public InventarioResponseDTO toResponseDTO(Inventario inv) {
        if (inv == null) return null;

        Long sectorId = inv.getSector() != null ? inv.getSector().getId() : null;
        String sectorNombre = inv.getSector() != null ? inv.getSector().getNombre() : null;

        Long materialId = inv.getMaterial() != null ? inv.getMaterial().getId() : null;
        String materialNombre = (inv.getMaterial() != null
                && inv.getMaterial().getTipoMaterial() != null)
                ? inv.getMaterial().getTipoMaterial().getNombre() : null;

        return new InventarioResponseDTO(
                inv.getId(),
                inv.getCantidadMinima(),
                inv.getCantidadMaxima(),
                sectorId,
                sectorNombre,
                materialId,
                materialNombre
        );
    }
}
