package com.h5.parent.controller;

import com.h5.consultant.dto.request.FindEmailRequestDto;
import com.h5.consultant.dto.request.UpdatePwdRequestDto;
import com.h5.consultant.dto.request.UpdateToTempPwdRequestDto;
import com.h5.parent.dto.response.MyPageResponseDto;
import com.h5.parent.service.ParentUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user/parent")
public class ParentUserController {

    private final ParentUserService parentUserService;

    @Autowired
    public ParentUserController(ParentUserService parentUserService) {
        this.parentUserService = parentUserService;
    }

    @PostMapping("/my-page")
    public MyPageResponseDto myPage() {
        return parentUserService.getMyPageInfo();
    }

    @PostMapping("/find-id")
    public ResponseEntity<String> findId(@Valid @RequestBody FindEmailRequestDto findEmailRequestDto) {
        String email = parentUserService.findId(findEmailRequestDto.getName(), findEmailRequestDto.getPhone()).getEmail();
        return ResponseEntity.ok(email);
    }

    @PostMapping("/temp-pwd")
    public ResponseEntity<String> updateToTempPwd(@Valid @RequestBody UpdateToTempPwdRequestDto updateToTempPwdRequestDto) {
        parentUserService.updateToTempPwd(updateToTempPwdRequestDto.getName(), updateToTempPwdRequestDto.getEmail());
        return ResponseEntity.ok("Temporary password sent successfully and updated.");
    }

    @PostMapping("/change-pwd")
    public ResponseEntity<?> updatePwd(@Valid @RequestBody UpdatePwdRequestDto updatePwdRequestDto) {
        parentUserService.updatePwd(updatePwdRequestDto.getOldPwd(),
                updatePwdRequestDto.getNewPwd());
        return ResponseEntity.ok("Password changed successfully.");
    }
    
    @GetMapping("/my-children")
    public ResponseEntity<?> myChildren() {
        return ResponseEntity.ok(parentUserService.myChildren());
    }

}
