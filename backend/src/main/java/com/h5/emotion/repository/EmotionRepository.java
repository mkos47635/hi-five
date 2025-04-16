package com.h5.emotion.repository;

import com.h5.emotion.entity.EmotionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmotionRepository extends JpaRepository<EmotionEntity, Integer> {

}
