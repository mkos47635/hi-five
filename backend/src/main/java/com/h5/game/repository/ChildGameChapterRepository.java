package com.h5.game.repository;

import com.h5.game.entity.ChildGameChapterEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChildGameChapterRepository extends JpaRepository<ChildGameChapterEntity, Integer> {
    Optional<List<ChildGameChapterEntity>> findByChildUserEntity_IdAndStartDttmBetween(int childUserId, LocalDateTime startDttm, LocalDateTime endDttm);
}
