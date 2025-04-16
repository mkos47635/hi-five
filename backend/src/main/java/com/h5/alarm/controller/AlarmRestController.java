package com.h5.alarm.controller;

import com.h5.alarm.dto.request.AlarmRequestDto;
import com.h5.alarm.service.AlarmService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/alarm")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AlarmRestController {

    private final AlarmService alarmService;

    @PostMapping("/")
    public ResponseEntity<?> triggerAlarm(@RequestBody AlarmRequestDto alarmRequestDto) {
        alarmService.sendAlarm(alarmRequestDto);
        return ResponseEntity.ok("Message send completed");
    }

}
