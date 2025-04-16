package com.h5.game.repository;

import com.h5.game.entity.AiLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AiLogRepository extends JpaRepository<AiLogEntity, Integer> {
}
