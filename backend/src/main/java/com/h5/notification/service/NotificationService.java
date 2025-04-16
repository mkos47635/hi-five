package com.h5.notification.service;

import com.h5.notification.dto.request.NotificationRequestDto;

public interface NotificationService {
    void sendNotificationToUser(NotificationRequestDto notificationRequestDto);
}
