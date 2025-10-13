package com.logipro.materials.domain.repository;

import com.logipro.claims.domain.model.Reclamo;
import com.logipro.materials.domain.model.Calidad;
import com.logipro.materials.domain.model.Material;
import com.logipro.materials.domain.model.TipoMaterial;
import com.logipro.supliers.domain.model.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface MaterialRepository extends JpaRepository <Material, Long>, JpaSpecificationExecutor<Material> {

    List<Material> findByProveedor(Proveedor proveedor);

    List<Material> findByTipoMaterial(TipoMaterial tipoMaterial);

    List<Material> findByCalidad(Calidad calidad);

    List<Material> findByReclamo(Reclamo reclamo);

    //utiles

    List<Material> findByCantidadGreaterThanEqual(Integer cantidad);
    boolean existsByReclamoAndTipoMaterial(Reclamo reclamo, TipoMaterial tipoMaterial);


    Optional<Material> findFirstByReclamoOrderByIdDesc(Reclamo reclamo);
}
