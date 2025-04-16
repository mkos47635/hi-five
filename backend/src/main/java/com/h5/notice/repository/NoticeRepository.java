package com.h5.notice.repository;

import com.h5.notice.entity.NoticeEntity;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface NoticeRepository extends JpaRepository<NoticeEntity, Integer> {
    //전체 글 + 페이징
    @Query("SELECT n FROM NoticeEntity n " +
            "JOIN ConsultantUserEntity cu ON n.consultantUser.id = cu.id " +
            "WHERE n.deleteDttm IS NULL " +
            "AND (" +
            "   (:consultantUserId IS NOT NULL AND cu.center.id = (" +
            "       SELECT c.center.id " +
            "       FROM ConsultantUserEntity c " +
            "       WHERE c.id = :consultantUserId" +
            "   )) " +
            "   OR (:parentUserId IS NOT NULL AND cu.center.id = (" +
            "       SELECT pc.center.id " +
            "       FROM ParentUserEntity p " +
            "       JOIN p.consultantUserEntity pc " +
            "       WHERE p.id = :parentUserId" +
            "   ))" +
            ")")
    Page<NoticeEntity> findAll(
            @Param("consultantUserId") Integer consultantUserId,
            @Param("parentUserId") Integer parentUserId,
            Pageable pageable
    );


    // 제목으로 검색 + 페이징
    @Query("SELECT n FROM NoticeEntity n " +
            "JOIN ConsultantUserEntity cu ON n.consultantUser.id = cu.id " +
            "WHERE n.title LIKE %:title% " +
            "AND n.deleteDttm IS NULL " +
            "AND (" +
            "   (:consultantUserId IS NOT NULL AND cu.center.id = (" +
            "       SELECT c.center.id " +
            "       FROM ConsultantUserEntity c " +
            "       WHERE c.id = :consultantUserId" +
            "   )) " +
            "   OR (:parentUserId IS NOT NULL AND cu.center.id = (" +
            "       SELECT pc.center.id " +
            "       FROM ParentUserEntity p " +
            "       JOIN p.consultantUserEntity pc " +
            "       WHERE p.id = :parentUserId" +
            "   ))" +
            ")")
    Page<NoticeEntity> findByTitle(
            @Param("title") String title,
            @Param("consultantUserId") Integer consultantUserId,
            @Param("parentUserId") Integer parentUserId,
            Pageable pageable
    );

    //작성자로 검색 + 페이징
    @Query("SELECT n FROM NoticeEntity n " +
            "JOIN ConsultantUserEntity cu ON n.consultantUser.id = cu.id " +
            "WHERE cu.name LIKE %:writer% " +
            "AND n.deleteDttm IS NULL " +
            "AND (" +
            "   (:consultantUserId IS NOT NULL AND cu.center.id = (" +
            "       SELECT c.center.id " +
            "       FROM ConsultantUserEntity c " +
            "       WHERE c.id = :consultantUserId" +
            "   )) " +
            "   OR (:parentUserId IS NOT NULL AND cu.center.id = (" +
            "       SELECT pc.center.id " +
            "       FROM ParentUserEntity p " +
            "       JOIN p.consultantUserEntity pc " +
            "       WHERE p.id = :parentUserId" +
            "   ))" +
            ")")
    Page<NoticeEntity> findByName(
            @Param("writer") String writer,
            @Param("consultantUserId") Integer consultantUserId,
            @Param("parentUserId") Integer parentUserId,
            Pageable pageable
    );

    //조회수 증가
    @Modifying
    @Query("UPDATE NoticeEntity n SET n.viewCnt = n.viewCnt + 1 WHERE n.id = :noticeId")
    void updateViewCnt (@Param("noticeId") int id);

    @Modifying
    @Transactional
    @Query("UPDATE NoticeEntity n SET n.deleteDttm = CURRENT_TIMESTAMP WHERE n.id = :noticeId")
    void updateDeleteDttmById(@Param("noticeId") int id);

}
