package com.logipro.supliers.domain.repository;

import com.logipro.supliers.domain.model.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**

 * Permite consultas sobre la tabla 'proveedor'.
 */
@Repository
public interface ProveedorRepository extends JpaRepository <Proveedor, Long> {

boolean existsByDescripcion(String descripcion);

}
