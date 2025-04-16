package com.h5.study.repository;

import com.h5.study.entity.StudyTextLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudyTextLogRepository extends JpaRepository<StudyTextLogEntity, Integer> {
}
