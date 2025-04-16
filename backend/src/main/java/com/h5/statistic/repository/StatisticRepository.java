package com.h5.statistic.repository;

import com.h5.statistic.entity.StatisticEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StatisticRepository extends JpaRepository<StatisticEntity, Integer> {
    Optional<StatisticEntity> findByEmotionEntity_IdAndChildUserEntity_Id(int emotionEntityId, int childUserId);
}
