package com.logipro.materials.domain.repository;

import com.logipro.materials.domain.model.DetalleCalidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleCalidadRepository extends JpaRepository<DetalleCalidad, Long> {
}
