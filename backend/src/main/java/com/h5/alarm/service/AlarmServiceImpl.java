package com.h5.alarm.service;

import com.h5.alarm.dto.AlarmDto;
import com.h5.alarm.dto.request.AlarmRequestDto;
import com.h5.child.repository.ChildUserRepository;
import com.h5.consultant.repository.ConsultantUserRepository;
import com.h5.global.config.SessionChannelInterceptor;
import com.h5.global.exception.UserNotFoundException;
import com.h5.parent.repository.ParentUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Transactional
public class AlarmServiceImpl implements AlarmService {

    private final SimpMessagingTemplate messagingTemplate;
    private final ParentUserRepository parentUserRepository;
    private final ConsultantUserRepository consultantUserRepository;
    private final ChildUserRepository childUserRepository;
    private final SessionChannelInterceptor sessionChannelInterceptor;

    @Override
    public void sendAlarm(AlarmRequestDto alarmRequestDto) {
        boolean isGame = "game".equals(alarmRequestDto.getSessionType());
        boolean isConsultantSender = "ROLE_CONSULTANT".equals(alarmRequestDto.getSenderRole());

        log.info("getSessionType: {}, getSenderRole: {} ", alarmRequestDto.getSessionType(), alarmRequestDto.getSenderRole());
        log.info("isGame: {}, isConsultantSender: {}", isGame, isConsultantSender);

        String message;
        String toUserEmail;

        if (isConsultantSender) {
            message = isGame
                    ? "선생님이 기다리고 있어요!"
                    : "상담사가 기다리고 있습니다!";
            toUserEmail = getParentEmail(alarmRequestDto.getToUserId());
        } else {
            message = isGame
                    ? "아이가 기다리고 있습니다!"
                    : "학부모님이 기다리고 있습니다!";
            toUserEmail = getConsultantEmail(alarmRequestDto.getToUserId());
        }

        AlarmDto alarmDto = AlarmDto.builder()
                .message(message)
                .toUserEmail(toUserEmail)
                .time(LocalDateTime.now())
                .build();

        String targetUsername = alarmDto.getToUserEmail();
        String targetSessionId = sessionChannelInterceptor.getSessionIdForUser(targetUsername);

        if (targetSessionId == null) {
            log.info("대상 사용자({})의 sessionId를 찾을 수 없습니다.", targetUsername);
            return;
        }

        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
        headerAccessor.setSessionId(targetSessionId);
        headerAccessor.setLeaveMutable(true);
        headerAccessor.setHeader("simpSessionId", targetSessionId);

        messagingTemplate.convertAndSendToUser(
                targetUsername,
                "/queue/alarms",
                alarmDto,
                headerAccessor.getMessageHeaders()
        );
    }

    private String getParentEmail(int childUserId) {
        int parentUserId = childUserRepository.findById(childUserId)
                .orElseThrow(UserNotFoundException::new)
                .getParentUserEntity()
                .getId();
        return parentUserRepository.findById(parentUserId)
                .orElseThrow(UserNotFoundException::new)
                .getEmail();
    }

    private String getConsultantEmail(int childUserId) {
        int consultantUserId = childUserRepository.findById(childUserId)
                .orElseThrow(UserNotFoundException::new)
                .getConsultantUserEntity().getId();
        return consultantUserRepository.findById(consultantUserId)
                .orElseThrow(UserNotFoundException::new)
                .getEmail();
    }

}
