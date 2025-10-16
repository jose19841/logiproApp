package com.logipro.materials.domain.repository;

import com.logipro.materials.domain.model.TipoMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoMaterialRepository extends JpaRepository<TipoMaterial, Long> {
}
