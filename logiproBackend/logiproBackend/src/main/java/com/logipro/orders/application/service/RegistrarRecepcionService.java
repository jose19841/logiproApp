package com.logipro.orders.application.service;

import com.logipro.orders.application.dto.request.DetalleRecepcionRequestDTO;
import com.logipro.orders.application.dto.request.RegistrarRecepcionRequestDTO;
import com.logipro.orders.application.dto.response.PedidoResponseDTO;
import com.logipro.orders.application.mapper.PedidoMapper;
import com.logipro.orders.application.usecase.RegistrarRecepcionUseCase;
import com.logipro.orders.domain.model.DetallePedido;
import com.logipro.orders.domain.model.Pedido;
import com.logipro.orders.domain.repository.PedidoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class RegistrarRecepcionService implements RegistrarRecepcionUseCase {

    private final PedidoRepository pedidoRepository;
    private final PedidoMapper pedidoMapper;


    @Override
    public PedidoResponseDTO ejecutar(RegistrarRecepcionRequestDTO request) {
        // Validaciones basicas del request
        if(request == null || request.getPedidoId() == null) {
            throw new IllegalArgumentException("El identificador del pedido es obligatorio");
        }
        if (request.getFechaEntregaReal() == null) {
            throw new IllegalArgumentException("La fecha de entrega real es obligatoria");
        }
        if (request.getDetalles() == null || request.getDetalles().isEmpty()) {
            throw new IllegalArgumentException("Debe incluir los detalles con las cantidades");
        }
        // cargar pedido
        Pedido pedido = pedidoRepository.findById(request.getPedidoId())
                .orElseThrow(()-> new EntityNotFoundException("Pedido no encontrado con id: " + request.getPedidoId()));

        // Indexar cantidades recibidas por id de detalle
        Map<Long, Integer> cantidadesPorMaterial = new HashMap<>();
        for (DetalleRecepcionRequestDTO detReq : request.getDetalles()) {
            if (detReq == null || detReq.getMaterialId() == null) {
                throw new IllegalArgumentException("El item de recepcion debe incluir 'materialId' y 'cantidadRecibida'");
            }
            if (detReq.getCantidadRecibida() == null || detReq.getCantidadRecibida() <0) {
                throw new IllegalArgumentException("La cantidad no puede ser nula ni negativa (materialId=" + detReq.getMaterialId() + ")");
            }
            cantidadesPorMaterial.put(detReq.getMaterialId(), detReq.getCantidadRecibida());
        }
        // Actualziar cantidades recibidas en los detalles del pedido
        for (DetallePedido det : pedido.getDetalles()) {
            Long materialId = det.getMaterial().getId();
            Integer recibida = cantidadesPorMaterial.getOrDefault(materialId, 0);

            // no permitir recibir mas de lo solicitado
            if (det.getCantidadSolicitada() != null && recibida > det.getCantidadSolicitada()) {
                throw new IllegalArgumentException(
                        "Cantidad recibida (" + recibida + ") no puede superar la solicitada (" +
                                det.getCantidadSolicitada() + ") para material id=" + materialId
                );
            }
            det.setCantidadRecibida(recibida);
        }

        // delegar transicion de estado + fecha al dominio
        pedido.registrarRecepcion(request.getFechaEntregaReal());

        // persisitir y retornar dto
        Pedido actualizado = pedidoRepository.save(pedido);
        return pedidoMapper.toResponseDTO(actualizado);
    }
}
