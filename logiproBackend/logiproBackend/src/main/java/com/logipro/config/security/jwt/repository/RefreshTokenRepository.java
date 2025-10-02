package com.logipro.config.security.jwt.repository;

import com.logipro.config.security.jwt.model.RefreshTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, Long> {

    Optional<RefreshTokenEntity> findByJti (String jti);

  List<RefreshTokenEntity> findAllByUserId(Long userId);
}
