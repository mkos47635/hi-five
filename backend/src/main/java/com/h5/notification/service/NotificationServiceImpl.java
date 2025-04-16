package com.h5.notification.service;

import com.h5.notification.dto.request.NotificationRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final SimpMessagingTemplate messagingTemplate;


    @Override
    public void sendNotificationToUser(NotificationRequestDto notificationRequestDto) {
        String targetUser = notificationRequestDto.getTargetUser();
        String message = notificationRequestDto.getMessage();

        messagingTemplate.convertAndSendToUser(targetUser, "/queue/notifications", message);
    }
}
