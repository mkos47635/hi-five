package com.h5.session.controller;

import com.h5.session.dto.request.CloseSessionRequestDto;
import com.h5.session.dto.request.ControlRequest;
import com.h5.session.dto.request.JoinSessionRequestDto;
import com.h5.session.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/session")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @PostMapping("/join")
    public ResponseEntity<String> joinOrCreateMeeting(@RequestBody JoinSessionRequestDto joinSessionRequestDto) {
        return ResponseEntity.ok(sessionService.joinMeeting(joinSessionRequestDto));
    }

    @PostMapping("/end")
    public ResponseEntity<?> endMeeting(@RequestBody CloseSessionRequestDto closeSessionRequestDto) {
        sessionService.endMeeting(closeSessionRequestDto);
        return ResponseEntity.ok("Meeting ended successfully");
    }

    @MessageMapping("/control")
    @SendTo("/topic")
    public ControlRequest handleWebSocketMessage(ControlRequest controlRequest) {
        if (controlRequest == null || controlRequest.getAction() == null) {
            throw new IllegalArgumentException("Invalid control request");
        }
        sessionService.processControlMessage(controlRequest);

        return controlRequest;
    }


}
