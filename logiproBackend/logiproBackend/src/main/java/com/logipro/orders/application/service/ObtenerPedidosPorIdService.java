package com.logipro.orders.application.service;

import com.logipro.orders.application.dto.response.PedidoResponseDTO;
import com.logipro.orders.application.mapper.PedidoMapper;
import com.logipro.orders.application.usecase.ObtenerPedidoPorIdUseCase;
import com.logipro.orders.domain.repository.PedidoRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ObtenerPedidosPorIdService implements ObtenerPedidoPorIdUseCase {

    private final PedidoRepository pedidoRepository;
    private final PedidoMapper pedidoMapper;

    @Override
    public Optional<PedidoResponseDTO> ejecutar(Long id) {
        return pedidoRepository.findById(id)
                .map(pedidoMapper::toResponseDTO);
    }
}
