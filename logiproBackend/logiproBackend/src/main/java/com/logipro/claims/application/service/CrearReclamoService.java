package com.logipro.claims.application.service;

import com.logipro.claims.application.dto.request.CrearReclamoRequestDTO;
import com.logipro.claims.application.dto.response.ReclamoResponseDTO;
import com.logipro.claims.application.mapper.ReclamoMapper;
import com.logipro.claims.application.usecase.CrearReclamoUseCase;
import com.logipro.claims.domain.model.DetalleReclamo;
import com.logipro.claims.domain.model.EstadoReclamo;
import com.logipro.claims.domain.model.Reclamo;
import com.logipro.claims.domain.repository.ReclamoRepository;
import com.logipro.supliers.domain.model.Proveedor;
import com.logipro.supliers.domain.repository.ProveedorRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CrearReclamoService implements CrearReclamoUseCase {

    private final ReclamoRepository reclamoRepository;
    private final ProveedorRepository proveedorRepository;
    private final ReclamoMapper reclamoMapper;
    private final EntityManager entityManager;

    @Override
    public ReclamoResponseDTO ejecutar(CrearReclamoRequestDTO request) {
        final String num = request.getNumReclamo().trim();
        final String desc = request.getDescripcion().trim();

        // Validar proveedor
        Proveedor proveedor= proveedorRepository.findById(request.getProveedorId())
                .orElseThrow(() -> new IllegalArgumentException("Proveedor no encontrado: id=" + request.getProveedorId()));

       // Validar duplicado de número de reclamo
        reclamoRepository.findByNumReclamo(num).ifPresent(r ->{
            throw new IllegalArgumentException("ya existe el reclamo con el numero: " + num);
        });

        // parsear estado (por defecto: PENDIENTE)

        EstadoReclamo estado = EstadoReclamo.PENDIENTE;
        if(request.getEstado() != null && request.getEstado().isBlank()){
            try {
                estado = EstadoReclamo.valueOf(request.getEstado().trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new RuntimeException("Estado invalido. Valores permitidos: PENDIENTE, EN_PROCESO, RESUELTO, CERRADO");

            }
        }

        // crear entidad de dominio
        Reclamo reclamo = new Reclamo(num, desc, proveedor, estado);

        // obtener referencia al detalle del reclamo (solo si se proporciona)
        if (request.getDetalleReclamoId() != null) {
            DetalleReclamo detalle = entityManager.getReference(DetalleReclamo.class, request.getDetalleReclamoId());
            reclamo.setDetalleReclamo(detalle);
        }

        // persistir
        Reclamo guardado = reclamoRepository.save(reclamo);

        // Mappear a dto de salida
        return reclamoMapper.toResponseDTO(guardado);
    }
}
