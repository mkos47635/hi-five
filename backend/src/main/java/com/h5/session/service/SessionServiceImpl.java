package com.h5.session.service;

import com.h5.global.exception.ScheduleNotFoundException;
import com.h5.schedule.entity.ConsultMeetingScheduleEntity;
import com.h5.schedule.entity.GameMeetingScheduleEntity;
import com.h5.schedule.repository.ConsultMeetingScheduleRepository;
import com.h5.schedule.repository.GameMeetingScheduleRepository;
import com.h5.session.dto.request.CloseSessionRequestDto;
import com.h5.session.dto.request.ControlRequest;
import com.h5.session.dto.request.JoinSessionRequestDto;
import com.h5.session.repository.ConsultSessionRepository;
import com.h5.session.repository.GameSessionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
@Transactional
public class SessionServiceImpl implements SessionService {
    private final GameMeetingScheduleRepository gameMeetingScheduleRepository;
    private final OpenViduServiceImpl openViduServiceImpl;
    private final GameSessionRepository gameSessionRepository;
    private final ConsultMeetingScheduleRepository consultMeetingScheduleRepository;
    private final OpenViduService openViduService;
    private final ConsultSessionRepository consultSessionRepository;

    private String startMeeting(String type, int scheduleId) {

        if("game".equals(type)){
            GameMeetingScheduleEntity gameMeetingScheduleEntity = gameMeetingScheduleRepository.findById(scheduleId)
                    .orElseThrow(ScheduleNotFoundException::new);

            if(gameMeetingScheduleEntity.getDeleteDttm() != null){
                throw new IllegalArgumentException("Meeting already ended");
            }

            String sessionId = openViduServiceImpl.createSession();
            gameSessionRepository.updateSessionId(gameMeetingScheduleEntity.getId(), sessionId);

            return sessionId;

        } else if ("consult".equals(type)) {
            ConsultMeetingScheduleEntity consultMeetingScheduleEntity = consultMeetingScheduleRepository.findById(scheduleId)
                    .orElseThrow(ScheduleNotFoundException::new);

            if(consultMeetingScheduleEntity.getSessionId() != null) {
                throw new IllegalArgumentException("Meeting already started");
            }
            if(consultMeetingScheduleEntity.getDeleteDttm() != null){
                throw new IllegalArgumentException("Meeting already ended");
            }

            String sessionId = openViduServiceImpl.createSession();
            consultSessionRepository.updateSessionId(consultMeetingScheduleEntity.getId(), sessionId);

            return sessionId;

        }else{
            throw new RuntimeException("wrong type");
        }
    }

    @Override
    public String joinMeeting(JoinSessionRequestDto joinSessionRequestDto) {
        int childId = joinSessionRequestDto.getChildId();
        String type = joinSessionRequestDto.getType();

        LocalDateTime currentDttm = LocalDateTime.now();

        if ("game".equals(type)) {
            GameMeetingScheduleEntity gameMeetingScheduleEntity = gameMeetingScheduleRepository.findNowSchedulesByChildId(childId, currentDttm)
                    .orElseThrow(ScheduleNotFoundException::new);
            int scheduleId = gameMeetingScheduleEntity.getId();

            String sessionId;
            if(gameMeetingScheduleEntity.getSessionId() == null) {
                sessionId = startMeeting(type, scheduleId);
            }else{
                sessionId = gameMeetingScheduleEntity.getSessionId();
            }

            return openViduService.createConnection(sessionId);

        }else if("consult".equals(type)) {
            ConsultMeetingScheduleEntity consultMeetingScheduleEntity = consultMeetingScheduleRepository.findNowSchedulesByChildId(childId, currentDttm)
                    .orElseThrow(ScheduleNotFoundException::new);
            int scheduleId = consultMeetingScheduleEntity.getId();

            String sessionId;
            if(consultMeetingScheduleEntity.getSessionId() == null) {
                sessionId = startMeeting(type, scheduleId);
            }else{
                sessionId = consultMeetingScheduleEntity.getSessionId();
            }

            return openViduService.createConnection(sessionId);

        }else{
            throw new RuntimeException("wrong type");
        }
    }

    @Override
    public void endMeeting(CloseSessionRequestDto closeSessionRequestDto) {
        String type = closeSessionRequestDto.getType();
        int schdlId = closeSessionRequestDto.getSchdlId();

        if ("game".equals(type)) {
            GameMeetingScheduleEntity gameMeeting = gameMeetingScheduleRepository.findById(schdlId)
                    .orElseThrow(() -> new IllegalArgumentException("Game meeting not found"));

            if ("E".equals(gameMeeting.getStatus())) {
                throw new IllegalStateException("Meeting already ended");
            }

            gameMeeting.setStatus("E");
            gameSessionRepository.save(gameMeeting);

        } else if ("consult".equals(type)) {
            ConsultMeetingScheduleEntity consultMeeting = consultMeetingScheduleRepository.findById(schdlId)
                    .orElseThrow(() -> new IllegalArgumentException("Consult meeting not found"));

            if ("E".equals(consultMeeting.getStatus())) {
                throw new IllegalStateException("Meeting already ended");
            }

            consultMeeting.setStatus("E");
            consultSessionRepository.save(consultMeeting);
        } else{
            throw new RuntimeException("wrong type");
        }

    }

    @Override
    public void processControlMessage(ControlRequest controlRequest) {
//        switch (controlRequest.getAction()) {
//            case "NEXT_STAGE":
//
//                break;
//            case "PAUSE_VIDEO":
//                break;
//            // 필요에 따라 다른 명령도 추가
//            default:
//                throw new IllegalArgumentException("Unknown control action: " + controlRequest.getAction());
//        }
    }

}
