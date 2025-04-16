package com.h5.auth.service;


import com.h5.auth.dto.request.LoginRequestDto;
import com.h5.auth.dto.response.GetUserInfoResponseDto;
import com.h5.auth.dto.response.LoginResponseDto;
import com.h5.auth.dto.response.RefreshAccessTokenResponseDto;

public interface AuthService {
    LoginResponseDto authenticateAndGenerateToken(LoginRequestDto loginRequestDto);

    void logout(String token);

    RefreshAccessTokenResponseDto refreshAccessToken();

    GetUserInfoResponseDto getUserInfo();
}
