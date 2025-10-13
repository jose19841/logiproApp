package com.logipro.claims.domain.repository;


import com.logipro.claims.domain.model.EstadoReclamo;
import com.logipro.claims.domain.model.Reclamo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReclamoRepository extends JpaRepository <Reclamo, Long>{

    /** Busca un reclamo por su número de reclamo */

    Optional<Reclamo> findByNumReclamo(String reclamo);

    /** Lista reclamos por estado (pendientes, en proceso, etc.) */

    List<Reclamo> findByEstado(EstadoReclamo estado);
}
