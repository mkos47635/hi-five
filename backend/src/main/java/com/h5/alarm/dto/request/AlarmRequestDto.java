package com.h5.alarm.dto.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AlarmRequestDto {
    private int toUserId;
    private String senderRole;
    private String sessionType;
}
