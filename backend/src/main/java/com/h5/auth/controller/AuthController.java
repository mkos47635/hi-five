package com.h5.auth.controller;

import com.h5.auth.dto.request.LoginRequestDto;
import com.h5.auth.dto.response.LoginResponseDto;
import com.h5.auth.dto.response.RefreshAccessTokenResponseDto;
import com.h5.auth.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequestDto) {
        LoginResponseDto loginResponseDto = authService.authenticateAndGenerateToken(loginRequestDto);
        return ResponseEntity.ok(loginResponseDto);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(String token) {
        authService.logout(token);
        return ResponseEntity.ok("Successfully logged out");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh() {
        RefreshAccessTokenResponseDto refreshAccessTokenResponseDto = authService.refreshAccessToken();
        return ResponseEntity.ok(refreshAccessTokenResponseDto);
    }

    @GetMapping("/get-user-info")
    public ResponseEntity<?> getUserInfo() {
        return ResponseEntity.ok(authService.getUserInfo());
    }

}
