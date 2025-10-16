package com.logipro.materials.application.service;

import com.logipro.materials.application.dto.request.FiltroMaterialesDTO;
import com.logipro.materials.application.dto.response.MaterialResponseDTO;
import com.logipro.materials.application.mapper.MaterialMapper;
import com.logipro.materials.application.usecase.ListarMaterialesUseCase;

import com.logipro.materials.domain.model.Material;
import com.logipro.materials.domain.repository.MaterialRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ListarMaterialesService implements ListarMaterialesUseCase {

    private final MaterialRepository materialRepository;
    private final MaterialMapper materialMapper;


    @Override
    public List<MaterialResponseDTO> ejecutar(FiltroMaterialesDTO filtro, int page, int size, String sortBy, String sortDir) {

        String sortProperty = (sortBy== null || sortBy.isBlank()) ? "id" : sortBy;
        Sort sort = "desc".equalsIgnoreCase(sortDir)
                ? Sort.by(sortProperty).descending()
                : Sort.by(sortProperty).ascending();

        int pageIndex = Math.max(page, 0);
        int pageSize = Math.max(size, 1);

        PageRequest pageRequest = PageRequest.of(pageIndex, pageSize, sort);

        // Construcción explícita de Specification con filtros opcionales
        Specification<Material> spec = (root,  cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if(filtro != null) {
                if(filtro.getProveedorId() != null) {
                    predicates.add(cb.equal(root.get("proveedor").get("id"), filtro.getProveedorId()));
                }
                if(filtro.getReclamoId() != null) {
                    predicates.add(cb.equal(root.get("reclamo").get("id"), filtro.getReclamoId()));
                }
                if(filtro.getTipoMaterialId() != null) {
                    predicates.add(cb.equal(root.get("tipoMaterial").get("id"), filtro.getTipoMaterialId()));
                }
                if(filtro.getCantidadMin() !=null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("cantidad"), filtro.getCantidadMin()));
                }
                if(filtro.getCantidadMax() != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get("cantidad"), filtro.getCantidadMax()));
                }
            }
            return predicates.isEmpty() ? null : cb.and(predicates.toArray(new Predicate[0]));
        };

        List<Material> contenidos = materialRepository.findAll(spec, pageRequest).getContent();
        return materialMapper.toResponseList(contenidos);
    }
}
