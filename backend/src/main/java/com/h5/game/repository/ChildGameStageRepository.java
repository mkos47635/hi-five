package com.h5.game.repository;

import com.h5.game.entity.ChildGameStageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChildGameStageRepository extends JpaRepository<ChildGameStageEntity, Integer> {
    Optional<List<ChildGameStageEntity>> findAllByChildGameChapterEntity_Id(int childGameChapterId);
}
