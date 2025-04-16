package com.h5.asset.repository;

import com.h5.asset.entity.GameChapterEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameChapterRepository extends JpaRepository<GameChapterEntity, Integer> {
}
