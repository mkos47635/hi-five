package com.h5.schedule.repository;

import com.h5.schedule.entity.GameMeetingScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface GameMeetingScheduleRepository extends JpaRepository<GameMeetingScheduleEntity, Integer> {

    @Query("SELECT g FROM GameMeetingScheduleEntity g WHERE g.host.id = :consultantUserId " +
            "AND DATE(g.schdlDttm) = :date AND g.deleteDttm IS NULL")
    List<GameMeetingScheduleEntity> findByHostIdAndSchdlDttm(
            @Param("consultantUserId") Integer consultantUserId,
            @Param("date") LocalDate date);

    @Query("SELECT DISTINCT DATE(g.schdlDttm) FROM GameMeetingScheduleEntity g " +
            "WHERE g.childUserEntity.id = :childUserId " +
            "AND YEAR(g.schdlDttm) = :year " +
            "AND MONTH(g.schdlDttm) = :month " +
            "AND g.deleteDttm IS NULL")
    List<String> findDatesByChildUserIdAndYearMonth(@Param("childUserId") Integer childUserId,
                                                    @Param("year") int year,
                                                    @Param("month") int month);

    @Query("SELECT g FROM GameMeetingScheduleEntity g " +
            "WHERE g.childUserEntity.id = :childUserId " +
            "AND YEAR(g.schdlDttm) = :year " +
            "AND MONTH(g.schdlDttm) = :month " +
            "AND g.deleteDttm IS NULL")
    List<GameMeetingScheduleEntity> findByChildUserIdAndYearMonth(@Param("childUserId") Integer childUserId,
                                                                  @Param("year") int year,
                                                                  @Param("month") int month);


    @Query("SELECT TIME_FORMAT(g.schdlDttm, '%H:%i') FROM GameMeetingScheduleEntity g " +
            "WHERE g.host.id = :consultantUserId AND DATE(g.schdlDttm) = :date AND g.deleteDttm IS NULL")
    List<String> findBookedTimesByConsultant(@Param("consultantUserId") Integer consultantUserId,
                                             @Param("date") LocalDate date);

    @Query("SELECT COUNT(g) > 0 FROM GameMeetingScheduleEntity g " +
            "WHERE g.host.id = :consultantUserId AND g.schdlDttm = :dateTime AND g.deleteDttm IS NULL")
    boolean existsByConsultantAndDateTime(@Param("consultantUserId") Integer consultantUserId,
                                          @Param("dateTime") LocalDateTime dateTime);


    @Modifying
    @Query("UPDATE GameMeetingScheduleEntity g SET g.deleteDttm = CURRENT_TIMESTAMP WHERE g.id = :id AND g.deleteDttm IS NULL")
    void modifyDeleteDttmById(@Param("id") int id);

    // 특정 부모의 아이들에 대한 연-월별 게임 일정 조회
    @Query("SELECT g FROM GameMeetingScheduleEntity g " +
            "WHERE g.childUserEntity.id IN :childUserIds " +
            "AND YEAR(g.schdlDttm) = :year " +
            "AND MONTH(g.schdlDttm) = :month " +
            "AND g.deleteDttm IS NULL")
    List<GameMeetingScheduleEntity> findByChildUserIdsAndYearMonth(@Param("childUserIds") List<Integer> childUserIds,
                                                                   @Param("year") int year,
                                                                   @Param("month") int month);

    // 특정 부모의 아이들에 대한 연-월별 게임 일정 날짜 목록 조회
    @Query("SELECT DISTINCT DATE(g.schdlDttm) FROM GameMeetingScheduleEntity g " +
            "WHERE g.childUserEntity.id IN :childUserIds " +
            "AND YEAR(g.schdlDttm) = :year " +
            "AND MONTH(g.schdlDttm) = :month " +
            "AND g.deleteDttm IS NULL")
    List<String> findDatesByChildUserIdsAndYearMonth(@Param("childUserIds") List<Integer> childUserIds,
                                                     @Param("year") int year,
                                                     @Param("month") int month);

    @Query(value = "SELECT * FROM game_meeting_schdl g " +
            "WHERE g.child_user_id = :childUserId " +
            "AND g.start_dttm <= :currentDttm " +
            "AND DATE_ADD(g.start_dttm, INTERVAL 70 MINUTE) > :currentDttm " +
            "AND g.delete_dttm IS NULL", nativeQuery = true)
    Optional<GameMeetingScheduleEntity> findNowSchedulesByChildId(
            @Param("childUserId") Integer childUserId,
            @Param("currentDttm") LocalDateTime currentDttm);


}

