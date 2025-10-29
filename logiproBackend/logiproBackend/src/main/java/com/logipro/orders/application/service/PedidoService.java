package com.logipro.orders.application.service;

import com.logipro.orders.application.dto.request.ActualizarPedidoRequestDTO;
import com.logipro.orders.application.dto.request.CrearPedidoRequestDTO;
import com.logipro.orders.application.dto.request.FiltroPedidosRequestDTO;
import com.logipro.orders.application.dto.request.RegistrarRecepcionRequestDTO;
import com.logipro.orders.application.dto.response.PedidoResponseDTO;
import com.logipro.orders.application.usecase.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class PedidoService {

    private final CrearPedidoUseCase crearPedidoUseCase;
    private final ActualizarPedidoUseCase actualizarPedidoUseCase;
    private final CambiarEstadoPedidoUseCase cambiarEstadoPedidoUseCase;
    private final EliminarPedidoUseCase eliminarPedidoUseCase;
    private final ListarPedidosUseCase listarPedidosUseCase;
    private final ObtenerPedidoPorIdUseCase obtenerPedidoPorIdUseCase;
    private final RegistrarRecepcionUseCase registrarRecepcionUseCase;

    public PedidoResponseDTO crear (CrearPedidoRequestDTO request) {
        return crearPedidoUseCase.ejecutar(request);
    }

    public PedidoResponseDTO actualizar(Long id, ActualizarPedidoRequestDTO request) {
        return actualizarPedidoUseCase.ejecutar(id, request);
    }

    public PedidoResponseDTO cambiarEstado (Long id, String nuevoEstado) {
        return cambiarEstadoPedidoUseCase.ejecutar(id, nuevoEstado);
    }

    public void eliminarPedido (Long id) {
         eliminarPedidoUseCase.ejecutar(id);
    }

    public List<PedidoResponseDTO> listarPedidos(FiltroPedidosRequestDTO filtros, int page, int size, String sortBy, String sortDir) {
        return listarPedidosUseCase.ejecutar(filtros, page, size, sortBy, sortDir);
    }

    public Optional<PedidoResponseDTO> obtenerPedidoPorId (Long id) {
        return obtenerPedidoPorIdUseCase.ejecutar(id);
    }

    public PedidoResponseDTO registrarRecepcion (RegistrarRecepcionRequestDTO request) {
        return registrarRecepcionUseCase.ejecutar(request);
    }


}
