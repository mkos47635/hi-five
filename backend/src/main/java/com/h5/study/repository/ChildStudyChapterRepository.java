package com.h5.study.repository;

import com.h5.study.entity.ChildStudyChapterEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChildStudyChapterRepository extends JpaRepository<ChildStudyChapterEntity, Integer> {
}
