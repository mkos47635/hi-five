package com.h5.consultant.controller;

import com.h5.consultant.dto.request.*;
import com.h5.consultant.service.ConsultantUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user/consultant")
public class ConsultantUserController {

    private final ConsultantUserService consultantUserService;

    @Autowired
    public ConsultantUserController(ConsultantUserService consultantUserService) {
        this.consultantUserService = consultantUserService;
    }

    @PostMapping("/find-id")
    public ResponseEntity<String> findId(@Valid @RequestBody FindEmailRequestDto findEmailRequestDto) {
        String email = consultantUserService.findId(findEmailRequestDto.getName(), findEmailRequestDto.getPhone()).getEmail();
        return ResponseEntity.ok(email);
    }

    @PostMapping("/temp-pwd")
    public ResponseEntity<String> updateToTempPwd(@Valid @RequestBody UpdateToTempPwdRequestDto updateToTempPwdRequestDto) {
        consultantUserService.updateToTempPwd(updateToTempPwdRequestDto.getName(), updateToTempPwdRequestDto.getEmail());
        return ResponseEntity.ok("Temporary password sent successfully and updated.");
    }

    @PostMapping("/change-pwd")
    public ResponseEntity<?> updatePwd(@Valid @RequestBody UpdatePwdRequestDto updatePwdRequestDto) {
        consultantUserService.updatePwd(updatePwdRequestDto.getOldPwd(),
                updatePwdRequestDto.getNewPwd());
        return ResponseEntity.ok("Password changed successfully.");
    }

    @PostMapping("/register-parent-account")
    public ResponseEntity<?> registerParentAccount(@Valid @RequestBody RegisterParentAccountDto registerParentAccountDto) {
        return ResponseEntity.ok(consultantUserService.registerParentAccount(registerParentAccountDto));
    }

    @GetMapping("/email-check")
    public ResponseEntity<?> emailCheck(@Valid @RequestParam String email) {
        return ResponseEntity.ok(consultantUserService.emailCheck(email));
    }

    @PostMapping("/get-my-children")
    public ResponseEntity<?> getMyChildren() {
        return ResponseEntity.ok(consultantUserService.getChildrenForAuthenticatedConsultant());
    }

    @GetMapping("/get-child")
    public ResponseEntity<?> getChild(@Valid @RequestParam int childUserId) {
        return ResponseEntity.ok(consultantUserService.getChild(childUserId));
    }

    @Transactional
    @PostMapping("/my-profile")
    public ResponseEntity<?> getMyProfile() {
        return ResponseEntity.ok(consultantUserService.getMyProfile());
    }

    @GetMapping("/search-child/{childUserName}")
    public ResponseEntity<?> searchChild(@Valid @PathVariable String childUserName) {
        return ResponseEntity.ok(consultantUserService.searchChild(childUserName));
    }

    @PostMapping("/modify-child")
    public ResponseEntity<?> modifyChild(@Valid @RequestBody ModifyChildRequestDto modifyChildRequestDto) {
        return ResponseEntity.ok(consultantUserService.modifyChild(modifyChildRequestDto));
    }
}
