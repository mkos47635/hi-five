package com.h5.qna.repository;

import com.h5.qna.entity.QnaEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QnaRepository extends JpaRepository<QnaEntity, Integer> {
    //r
    //전체 목록
    @Query("SELECT q FROM QnaEntity q " +
            "WHERE ((:role = 'ROLE_PARENT' AND q.parentUser.id = :parentUserId) " +
            "OR (:role = 'ROLE_CONSULTANT' AND q.parentUser.consultantUserEntity.id = :consultantUserId)) " +
            "AND q.deleteDttm IS NULL")
    Page<QnaEntity> findAll(
            @Param("role") String role,
            @Param("parentUserId") Integer parentUserId,
            @Param("consultantUserId") Integer consultantUserId,
            Pageable pageable
    );

    //조건부 (제목)
    @Query("SELECT q FROM QnaEntity q " +
            "WHERE (:role = 'ROLE_PARENT' AND q.parentUser.id = :parentUserId " +
            "       OR :role = 'ROLE_CONSULTANT' AND q.parentUser.consultantUserEntity.id = :consultantUserId) " +
            "AND q.deleteDttm IS NULL " +
            "AND (:title IS NULL OR q.title LIKE %:title%)")
    Page<QnaEntity> findByTitle(
            @Param("role") String role,
            @Param("parentUserId") Integer parentUserId,
            @Param("consultantUserId") Integer consultantUserId,
            @Param("title") String title,
            Pageable pageable
    );

    //조건부 (작성자)
    @Query("SELECT q FROM QnaEntity q " +
            "WHERE (:role = 'ROLE_PARENT' AND q.parentUser.id = :parentUserId " +
            "       OR :role = 'ROLE_CONSULTANT' AND q.parentUser.consultantUserEntity.id = :consultantUserId) " +
            "AND q.deleteDttm IS NULL " +
            "AND (:writer IS NULL OR q.parentUser.name LIKE %:writer%)")
    Page<QnaEntity> findByName(
            @Param("role") String role,
            @Param("parentUserId") Integer parentUserId,
            @Param("consultantUserId") Integer consultantUserId,
            @Param("writer") String writer,
            Pageable pageable
    );

}
