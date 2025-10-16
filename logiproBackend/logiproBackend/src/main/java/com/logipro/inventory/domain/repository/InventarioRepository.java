package com.logipro.inventory.domain.repository;

import com.logipro.inventory.domain.model.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventarioRepository extends JpaRepository<Inventario, Long> {

    List<Inventario> findBySector_Id(Long sectorId);

    List<Inventario> findByMaterial_Id(Long materialId);

    Optional<Inventario> findByMaterial_IdAndSector_Id(Long materialId, Long sectorId);

    boolean existsByMaterial_IdAndSector_Id(Long materialId, Long sectorId);



}
