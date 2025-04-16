package com.h5.session.repository;

import com.h5.schedule.entity.ConsultMeetingScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsultSessionRepository extends JpaRepository<ConsultMeetingScheduleEntity, Integer> {

    @Modifying
    @Query("UPDATE ConsultMeetingScheduleEntity c SET c.sessionId = :sessionId, c.status = 'A' WHERE c.id = :meetingId")
    void updateSessionId(@Param("meetingId") int meetingId, @Param("sessionId") String sessionId);
}
