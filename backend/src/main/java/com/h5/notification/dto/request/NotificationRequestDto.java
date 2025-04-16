package com.h5.notification.dto.request;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class NotificationRequestDto {
    private String targetUser;
    private String message;
}
