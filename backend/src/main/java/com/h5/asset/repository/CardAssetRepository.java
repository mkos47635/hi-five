package com.h5.asset.repository;

import com.h5.asset.entity.CardAssetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CardAssetRepository extends JpaRepository<CardAssetEntity, Integer> {
    List<CardAssetEntity> findByGameStageEntity_IdLessThanEqual(int cleared);

    Optional<CardAssetEntity> findByGameStageEntity_Id(Integer gameStageEntityId);
}
