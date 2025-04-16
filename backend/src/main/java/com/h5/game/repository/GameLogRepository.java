package com.h5.game.repository;

import com.h5.game.entity.GameLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface GameLogRepository extends JpaRepository<GameLogEntity, Integer> {
    Optional<List<GameLogEntity>> findAllByChildUserEntity_IdAndGameStageEntity_IdAndSubmitDttmBetween(int childUserId, int stageId, LocalDateTime startDate, LocalDateTime endDate);
}
