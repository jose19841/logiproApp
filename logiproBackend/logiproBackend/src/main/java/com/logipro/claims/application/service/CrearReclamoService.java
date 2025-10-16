package com.logipro.claims.application.service;

import com.logipro.claims.application.dto.request.CrearReclamoRequestDTO;
import com.logipro.claims.application.dto.response.ReclamoResponseDTO;
import com.logipro.claims.application.mapper.ReclamoMapper;
import com.logipro.claims.application.usecase.CrearReclamoUseCase;
import com.logipro.claims.domain.model.DetalleReclamo;
import com.logipro.claims.domain.model.EstadoReclamo;
import com.logipro.claims.domain.model.Reclamo;
import com.logipro.claims.domain.repository.DetalleReclamoRepository;
import com.logipro.claims.domain.repository.ReclamoRepository;
import com.logipro.supliers.domain.model.Proveedor;
import com.logipro.supliers.domain.repository.ProveedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CrearReclamoService implements CrearReclamoUseCase {

    private final ReclamoRepository reclamoRepository;
    private final ProveedorRepository proveedorRepository;
    private final DetalleReclamoRepository detalleReclamoRepository;
    private final ReclamoMapper reclamoMapper;

    @Override
    public ReclamoResponseDTO ejecutar(CrearReclamoRequestDTO request) {
        // Validar proveedor
        Proveedor proveedor = proveedorRepository.findById(request.getProveedorId())
                .orElseThrow(() -> new IllegalArgumentException("Proveedor no encontrado: id=" + request.getProveedorId()));

        // Validar duplicado de número de reclamo
        reclamoRepository.findByNumReclamo(request.getNumReclamo().trim()).ifPresent(r -> {
            throw new IllegalArgumentException("Ya existe un reclamo con el número: " + request.getNumReclamo());
        });

        // Parsear estado (por defecto: PENDIENTE)
        EstadoReclamo estado = EstadoReclamo.PENDIENTE;
        if (request.getEstado() != null && !request.getEstado().isBlank()) {
            try {
                estado = EstadoReclamo.valueOf(request.getEstado().trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new IllegalArgumentException("Estado inválido. Valores permitidos: PENDIENTE, EN_PROCESO, RESUELTO, CERRADO");
            }
        }

        // Crear entidad usando constructor (ya hace trim y validaciones)
        Reclamo reclamo = new Reclamo(
            request.getNumReclamo(),
            request.getDescripcion(),
            proveedor,
            estado
        );

        // Asignar detalle si se proporciona
        if (request.getDetalleReclamoId() != null) {
            DetalleReclamo detalle = detalleReclamoRepository.findById(request.getDetalleReclamoId())
                .orElseThrow(() -> new IllegalArgumentException("Detalle de reclamo no encontrado: id=" + request.getDetalleReclamoId()));
            reclamo.asignarDetalle(detalle);
        }

        // Persistir y mapear
        Reclamo guardado = reclamoRepository.save(reclamo);
        return reclamoMapper.toResponseDTO(guardado);
    }
}
