package com.h5.auth.service;

import com.h5.auth.dto.request.LoginRequestDto;
import com.h5.auth.dto.response.GetUserInfoResponseDto;
import com.h5.auth.dto.response.LoginResponseDto;
import com.h5.auth.dto.response.RefreshAccessTokenResponseDto;
import com.h5.consultant.entity.ConsultantUserEntity;
import com.h5.consultant.repository.ConsultantUserRepository;
import com.h5.global.exception.UserNotFoundException;
import com.h5.global.util.JwtUtil;
import com.h5.parent.entity.ParentUserEntity;
import com.h5.parent.repository.ParentUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
public class AuthServiceImpl implements AuthService {

    private final RedisTemplate<Object, Object> redisTemplate;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final ConsultantCustomUserDetailService consultantCustomUserDetailService;
    private final ParentCustomUserDetailService parentCustomUserDetailService;
    private final ConsultantUserRepository consultantUserRepository;
    private final ParentUserRepository parentUserRepository;

    private final long REDIS_REFRESH_TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 15; // 15 days;

    @Autowired
    public AuthServiceImpl(RedisTemplate<Object, Object> redisTemplate,
                           AuthenticationManager authenticationManager,
                           JwtUtil jwtUtil,
                           ConsultantCustomUserDetailService consultantCustomUserDetailService,
                           ParentCustomUserDetailService parentCustomUserDetailService,
                           ConsultantUserRepository consultantUserRepository,
                           ParentUserRepository parentUserRepository) {
        this.redisTemplate = redisTemplate;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.consultantCustomUserDetailService = consultantCustomUserDetailService;
        this.parentCustomUserDetailService = parentCustomUserDetailService;
        this.consultantUserRepository = consultantUserRepository;
        this.parentUserRepository = parentUserRepository;
    }

    @Override
    public LoginResponseDto authenticateAndGenerateToken(LoginRequestDto loginRequestDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDto.getEmail(),
                        loginRequestDto.getPwd()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        return "ROLE_CONSULTANT".equals(loginRequestDto.getRole()) ?
                processConsultantLogin(loginRequestDto, userDetails) :
                processParentLogin(loginRequestDto, userDetails);
    }

    private LoginResponseDto processConsultantLogin(LoginRequestDto loginRequestDto, UserDetails userDetails) {
        ConsultantUserEntity consultantUser = getConsultantUser(loginRequestDto.getEmail());
        return generateLoginResponse(consultantUser.getName(), userDetails, consultantUser.isTempPwd());
    }

    private LoginResponseDto processParentLogin(LoginRequestDto loginRequestDto, UserDetails userDetails) {
        ParentUserEntity parentUser = getParentUser(loginRequestDto.getEmail());
        return generateLoginResponse(parentUser.getName(), userDetails, parentUser.isTempPwd());
    }

    private ConsultantUserEntity getConsultantUser(String email) {
        return consultantUserRepository.findByEmailAndDeleteDttmIsNull(email)
                .orElseThrow(UserNotFoundException::new);
    }

    private ParentUserEntity getParentUser(String email) {
        return parentUserRepository.findByEmailAndDeleteDttmIsNull(email)
                .orElseThrow(UserNotFoundException::new);
    }

    private LoginResponseDto generateLoginResponse(String name, UserDetails userDetails, boolean isTempPwd) {
        String accessToken = jwtUtil.generateAccessToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);
        updateRefreshToken(userDetails.getUsername(), refreshToken);
        return LoginResponseDto.builder()
                .name(name)
                .accessToken(accessToken)
                .pwdChanged(isTempPwd)
                .build();
    }

    private void updateRefreshToken(String email, String refreshToken) {
        redisTemplate.opsForValue().set(email, refreshToken, Duration.ofDays(REDIS_REFRESH_TOKEN_EXPIRE_TIME));
    }

    private void deleteRefreshToken(String email) {
        redisTemplate.delete(email);
    }

    @Override
    public void logout(String token) {
        String jwt = token.replace("Bearer ", "");
        validateToken(jwt);
        String email = jwtUtil.getEmailFromToken(jwt);
        deleteRefreshToken(email);
        addTokenToBlacklist(jwt);
    }

    private void validateToken(String token) {
        if (!jwtUtil.validateToken(token)) {
            throw new IllegalArgumentException("Invalid JWT token");
        }
    }

    private void addTokenToBlacklist(String token) {
        long expiration = jwtUtil.getExpiration(token) - System.currentTimeMillis();
        if (expiration > 0) {
            redisTemplate.opsForValue().set(token, "blacklisted", expiration, TimeUnit.MILLISECONDS);
        }
    }

    @Override
    public RefreshAccessTokenResponseDto refreshAccessToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        String storedRefreshToken = (String) redisTemplate.opsForValue().get(email);

        if (storedRefreshToken == null) {
            throw new IllegalArgumentException("Refresh token not found. Please login again.");
        }

        if (jwtUtil.isRefreshTokenExpired(storedRefreshToken)) {
            redisTemplate.delete(email);
            throw new IllegalArgumentException("Refresh token expired. Please login again.");
        }

        UserDetails userDetails = loadUser(email);
        String newAccessToken = jwtUtil.generateAccessToken(userDetails);
        refreshTokenIfNeeded(storedRefreshToken, userDetails, email);

        return RefreshAccessTokenResponseDto.builder()
                .accessToken(newAccessToken)
                .build();
    }

    @Override
    public GetUserInfoResponseDto getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse(null);

        String name = findUserNameByEmail(email);

        return GetUserInfoResponseDto.builder()
                .name(name)
                .role(role)
                .build();
    }

    private String findUserNameByEmail(String email) {
        Optional<ConsultantUserEntity> consultantUser = consultantUserRepository.findByEmail(email);
        if (consultantUser.isPresent()) {
            return consultantUser.get().getName();
        }

        Optional<ParentUserEntity> parentUser = parentUserRepository.findByEmail(email);
        return parentUser.map(ParentUserEntity::getName).orElseThrow(UserNotFoundException::new);
    }


    private void refreshTokenIfNeeded(String refreshToken, UserDetails userDetails, String email) {
        if (jwtUtil.isTokenNearExpiry(refreshToken)) {
            String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);
            addTokenToBlacklist(refreshToken);
            updateRefreshToken(email, newRefreshToken);
        }
    }

    private UserDetails loadUser(String email) {
        return consultantUserRepository.existsByEmail(email) ?
                consultantCustomUserDetailService.loadUserByUsername(email) :
                parentCustomUserDetailService.loadUserByUsername(email);
    }
}
