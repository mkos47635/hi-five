package com.h5.qna.repository;

import com.h5.qna.entity.QnaAnswerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QnaAnswerRepository extends JpaRepository<QnaAnswerEntity, Integer> {
    List<QnaAnswerEntity> findByQnaEntity_IdAndDeleteDttmIsNull(Integer qnaId);

    @Query("SELECT COUNT(a) FROM QnaAnswerEntity a WHERE a.qnaEntity.id = :qnaId AND a.deleteDttm IS NULL")
    int countByQnaEntity_Id(@Param("qnaId") Integer qnaId);
}
