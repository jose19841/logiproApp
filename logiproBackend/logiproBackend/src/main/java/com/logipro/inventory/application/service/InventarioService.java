package com.logipro.inventory.application.service;

import com.logipro.inventory.application.dto.request.ActualizarInventarioRequestDTO;
import com.logipro.inventory.application.dto.request.CrearInventarioRequestDTO;
import com.logipro.inventory.application.dto.request.ListarInventarioRequestDTO;
import com.logipro.inventory.application.dto.response.InventarioResponseDTO;
import com.logipro.inventory.application.usecase.*;
import com.logipro.inventory.domain.model.Inventario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class InventarioService {
    private final CrearInventarioUseCase crear;
    private final ListarInventarioUseCase listar;
    private final ActualizarInventarioUseCase actualizar;
    private final ObtenerInventarioUseCase obtener;
    private final EliminarInventarioUseCase eliminar;

    public Inventario crear (CrearInventarioRequestDTO dto) {
        return crear.ejecutar(dto);
    }

    public List<InventarioResponseDTO> listar (ListarInventarioRequestDTO dto) {
        return listar.ejecutar(dto);
    }
    public InventarioResponseDTO obtener (Long inventarioId) {
        return obtener.ejecutar(inventarioId);
    }

    public InventarioResponseDTO actualizar (ActualizarInventarioRequestDTO dto) {
        return actualizar.ejecutar(dto);
    }

    public void eliminar (Long inventarioId) {
        eliminar.ejecutar(inventarioId);
    }
}
