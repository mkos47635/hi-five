package com.h5.alarm.service;

import com.h5.alarm.dto.request.AlarmRequestDto;

public interface AlarmService {
    void sendAlarm(AlarmRequestDto alarmRequestDto);
}
