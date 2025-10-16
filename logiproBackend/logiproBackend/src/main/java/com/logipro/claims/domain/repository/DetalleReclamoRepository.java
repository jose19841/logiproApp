package com.logipro.claims.domain.repository;

import com.logipro.claims.domain.model.DetalleReclamo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleReclamoRepository extends JpaRepository<DetalleReclamo, Long> {
}
