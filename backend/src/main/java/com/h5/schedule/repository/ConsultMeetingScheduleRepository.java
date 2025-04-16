package com.h5.schedule.repository;

import com.h5.schedule.entity.ConsultMeetingScheduleEntity;
import com.h5.schedule.entity.GameMeetingScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConsultMeetingScheduleRepository extends JpaRepository<ConsultMeetingScheduleEntity, Integer> {

    @Query("SELECT c FROM ConsultMeetingScheduleEntity c WHERE c.host.id = :consultantUserId " +
            "AND DATE(c.schdlDttm) = :date AND c.deleteDttm IS NULL")
    List<ConsultMeetingScheduleEntity> findByHostIdAndSchdlDttm(
            @Param("consultantUserId") Integer consultantUserId,
            @Param("date") LocalDate date);

    @Query("SELECT DISTINCT DATE(c.schdlDttm) FROM ConsultMeetingScheduleEntity c " +
            "WHERE c.childUserEntity.id = :childUserId " +
            "AND YEAR(c.schdlDttm) = :year " +
            "AND MONTH(c.schdlDttm) = :month " +
            "AND c.deleteDttm IS NULL")
    List<String> findDatesByChildUserIdAndYearMonth(@Param("childUserId") Integer childUserId,
                                                    @Param("year") int year,
                                                    @Param("month") int month);

    @Query("SELECT c FROM ConsultMeetingScheduleEntity c " +
            "WHERE c.childUserEntity.id = :childUserId " +
            "AND YEAR(c.schdlDttm) = :year " +
            "AND MONTH(c.schdlDttm) = :month " +
            "AND c.deleteDttm IS NULL")
    List<ConsultMeetingScheduleEntity> findByChildUserIdAndYearMonth(@Param("childUserId") Integer childUserId,
                                                                     @Param("year") int year,
                                                                     @Param("month") int month);


    @Query("SELECT TIME_FORMAT(c.schdlDttm, '%H:%i') FROM ConsultMeetingScheduleEntity c " +
            "WHERE c.host.id = :consultantUserId AND DATE(c.schdlDttm) = :date AND c.deleteDttm IS NULL")
    List<String> findBookedTimesByConsultant(@Param("consultantUserId") Integer consultantUserId,
                                             @Param("date") LocalDate date);

    @Query("SELECT COUNT(c) > 0 FROM ConsultMeetingScheduleEntity c " +
            "WHERE c.host.id = :consultantUserId AND c.schdlDttm = :dateTime AND c.deleteDttm IS NULL")
    boolean existsByConsultantAndDateTime(@Param("consultantUserId") Integer consultantUserId,
                                          @Param("dateTime") LocalDateTime dateTime);

    @Modifying
    @Query("UPDATE ConsultMeetingScheduleEntity c SET c.deleteDttm = CURRENT_TIMESTAMP WHERE c.id = :id AND c.deleteDttm IS NULL")
    void modifyDeleteDttmById(@Param("id") Integer id);

    // 특정 부모의 아이들에 대한 연-월별 상담 일정 조회
    @Query("SELECT c FROM ConsultMeetingScheduleEntity c " +
            "WHERE c.childUserEntity.id IN :childUserIds " +
            "AND YEAR(c.schdlDttm) = :year " +
            "AND MONTH(c.schdlDttm) = :month " +
            "AND c.deleteDttm IS NULL")
    List<ConsultMeetingScheduleEntity> findByChildUserIdsAndYearMonth(@Param("childUserIds") List<Integer> childUserIds,
                                                                      @Param("year") int year,
                                                                      @Param("month") int month);

    // 특정 부모의 아이들에 대한 연-월별 상담 일정 날짜 목록 조회
    @Query("SELECT DISTINCT DATE(c.schdlDttm) FROM ConsultMeetingScheduleEntity c " +
            "WHERE c.childUserEntity.id IN :childUserIds " +
            "AND YEAR(c.schdlDttm) = :year " +
            "AND MONTH(c.schdlDttm) = :month " +
            "AND c.deleteDttm IS NULL")
    List<String> findDatesByChildUserIdsAndYearMonth(@Param("childUserIds") List<Integer> childUserIds,
                                                     @Param("year") int year,
                                                     @Param("month") int month);

    @Query(value = "SELECT * FROM consult_meeting_schdl c " +
            "WHERE c.child_user_id = :childUserId " +
            "AND c.start_dttm <= :currentDttm " +
            "AND DATE_ADD(c.start_dttm, INTERVAL 70 MINUTE) > :currentDttm " +
            "AND c.delete_dttm IS NULL", nativeQuery = true)
    Optional<ConsultMeetingScheduleEntity> findNowSchedulesByChildId(
            @Param("childUserId") Integer childUserId,
            @Param("currentDttm") LocalDateTime currentDttm);

}
