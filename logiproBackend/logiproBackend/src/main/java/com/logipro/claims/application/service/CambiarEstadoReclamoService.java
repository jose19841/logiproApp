package com.logipro.claims.application.service;

import com.logipro.claims.application.dto.request.CambiarEstadoReclamoRequestDTO;
import com.logipro.claims.application.dto.response.ReclamoResponseDTO;
import com.logipro.claims.application.mapper.ReclamoMapper;
import com.logipro.claims.application.usecase.CambiarEstadoReclamoUseCase;
import com.logipro.claims.domain.model.EstadoReclamo;
import com.logipro.claims.domain.model.Reclamo;
import com.logipro.claims.domain.repository.ReclamoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CambiarEstadoReclamoService implements CambiarEstadoReclamoUseCase {
    private final ReclamoRepository reclamoRepository;
    private final ReclamoMapper reclamoMapper;

    @Override
    public Optional<ReclamoResponseDTO> ejecutar(Long idReclamo, CambiarEstadoReclamoRequestDTO request) {
        return reclamoRepository.findById(idReclamo).map(reclamo ->{

            // Parsear/validar el estado entrante
            final String raw = request.getEstado().trim().toUpperCase(Locale.ROOT);
            final EstadoReclamo nuevoEstado;
            try {
                nuevoEstado = EstadoReclamo.valueOf(raw);
            } catch (IllegalArgumentException ex) {
                throw new IllegalArgumentException(
                        "Estado invalido. Valores permitidos: PENDIENTE, EN_PROCESO, RESUELTO, CERRADO"
                );
            }
            // Regla de dominio (ya tenés el método en la entidad)
            reclamo.cambiarEstado(nuevoEstado);

            // Persistir y mapear
            Reclamo guardado = reclamoRepository.save(reclamo);
            return reclamoMapper.toResponseDTO(guardado);
        });
    }
}
