package com.logipro.materials.domain.repository;

import com.logipro.materials.domain.model.Calidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalidadRepository extends JpaRepository<Calidad, Long> {
}
