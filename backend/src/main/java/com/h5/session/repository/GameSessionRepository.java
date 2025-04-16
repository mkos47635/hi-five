package com.h5.session.repository;

import com.h5.schedule.entity.GameMeetingScheduleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GameSessionRepository extends JpaRepository<GameMeetingScheduleEntity, Integer> {

    @Modifying
    @Query("UPDATE GameMeetingScheduleEntity g SET g.sessionId = :sessionId, g.status = 'A' WHERE g.id = :meetingId")
    void updateSessionId(@Param("meetingId") int meetingId, @Param("sessionId") String sessionId);


}
