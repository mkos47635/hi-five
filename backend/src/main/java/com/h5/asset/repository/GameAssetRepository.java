package com.h5.asset.repository;

import com.h5.asset.entity.GameAssetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameAssetRepository extends JpaRepository<GameAssetEntity, Integer> {

    @Query("""
    SELECT ga FROM GameAssetEntity ga
    JOIN ga.gameStageEntity gs
    WHERE gs.gameChapterEntity.id = :chapter
      AND gs.stage = :stage
    """)
    Optional<GameAssetEntity> findGameAssetByChapterAndStage(@Param("chapter") int chapter,
                                                            @Param("stage") int stage);

    List<GameAssetEntity> findByIdBetween(Integer idBefore, Integer IdAfter);
}
