package com.h5.faq.repository;

import com.h5.faq.entity.FaqEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FaqRepository extends JpaRepository<FaqEntity, Integer> {
    //전체 목록
    @Query("SELECT f FROM FaqEntity f " +
            "WHERE (:role = 'ROLE_PARENT' AND f.consultantUser.center.id = " +
            "(SELECT p.consultantUserEntity.center.id FROM ParentUserEntity p WHERE p.id = :parentUserId)) " +
            "OR (:role = 'ROLE_CONSULTANT' AND f.consultantUser.center.id = " +
            "(SELECT c.center.id FROM ConsultantUserEntity c WHERE c.id = :consultantUserId)) ")
//            +"AND f.deleteDttm IS NULL")
    Page<FaqEntity> findAll(
            @Param("role") String role,
            @Param("parentUserId") Integer parentUserId,
            @Param("consultantUserId") Integer consultantUserId,
            Pageable pageable
    );

    // 제목으로 검색
    @Query("SELECT f FROM FaqEntity f " +
            "WHERE ((:role = 'ROLE_PARENT' AND f.consultantUser.center.id = " +
            "(SELECT p.consultantUserEntity.center.id FROM ParentUserEntity p WHERE p.id = :parentUserId)) " +
            "OR (:role = 'ROLE_CONSULTANT' AND f.consultantUser.center.id = " +
            "(SELECT c.center.id FROM ConsultantUserEntity c WHERE c.id = :consultantUserId))) " +
            "AND f.title LIKE %:title%")
    Page<FaqEntity> findByTitle(
            @Param("role") String role,
            @Param("parentUserId") Integer parentUserId,
            @Param("consultantUserId") Integer consultantUserId,
            @Param("title") String title,
            Pageable pageable
    );

    // 작성자로 검색
    @Query("SELECT f FROM FaqEntity f " +
            "WHERE ((:role = 'ROLE_PARENT' AND f.consultantUser.center.id = " +
            "(SELECT p.consultantUserEntity.center.id FROM ParentUserEntity p WHERE p.id = :parentUserId)) " +
            "OR (:role = 'ROLE_CONSULTANT' AND f.consultantUser.center.id = " +
            "(SELECT c.center.id FROM ConsultantUserEntity c WHERE c.id = :consultantUserId))) " +
            "AND f.consultantUser.name LIKE CONCAT('%', :writer, '%')")
    Page<FaqEntity> findByEmail(
            @Param("role") String role,
            @Param("parentUserId") Integer parentUserId,
            @Param("consultantUserId") Integer consultantUserId,
            @Param("writer") String writer,
            Pageable pageable
    );


}
