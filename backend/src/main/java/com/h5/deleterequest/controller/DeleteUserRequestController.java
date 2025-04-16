package com.h5.deleterequest.controller;

import com.h5.deleterequest.service.DeleteUserRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user/delete")
public class DeleteUserRequestController {

    private final DeleteUserRequestService deleteUserRequestService;

    @Autowired
    public DeleteUserRequestController(DeleteUserRequestService deleteUserRequestService) {
        this.deleteUserRequestService = deleteUserRequestService;
    }

    // 탈퇴 요청
    @PostMapping("/request")
    public ResponseEntity<?> deleteRequest() {
        return ResponseEntity.ok(deleteUserRequestService.deleteRequest());
    }

    // 탈퇴 승인
    @GetMapping("/approve")
    public ResponseEntity<?> approve(@Valid @RequestParam Integer deleteUserRequestId) {
        return ResponseEntity.ok(deleteUserRequestService.deleteApprove(deleteUserRequestId));
    }

    // 탈퇴 거절
    @GetMapping("/reject")
    public ResponseEntity<?> reject(@Valid @RequestParam Integer deleteUserRequestId) {
        return ResponseEntity.ok(deleteUserRequestService.deleteReject(deleteUserRequestId));
    }

    // 내 탈퇴 요청 리스트
    @PostMapping("/get-my-delete")
    public ResponseEntity<?> getMyDelete() {
        return ResponseEntity.ok(deleteUserRequestService.getMyDelete());
    }
}
