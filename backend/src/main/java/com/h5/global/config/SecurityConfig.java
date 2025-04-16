package com.h5.global.config;

import com.h5.auth.service.ConsultantCustomUserDetailService;
import com.h5.auth.service.ParentCustomUserDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Autowired
    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // CORS 설정
        http.cors(cors -> cors.configurationSource(request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.addAllowedOriginPattern("*"); // 허용할 도메인 추가
            config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD")); // 허용할 HTTP 메서드
            config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
            config.setAllowCredentials(true); // 쿠키 전송 허용
            return config;
        }));

        // 필터 설정 및 경로별 권한 설정
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        // 인증 정보가 없어도 가능
                        .requestMatchers("/api/swagger-config/**", "/api/v3/api-docs/**", "/api/webjars/**").permitAll()
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/user/consultant/find-id", "/api/user/consultant/temp-pwd").permitAll()
                        .requestMatchers("/api/user/parent/find-id", "/api/user/parent/temp-pwd").permitAll()
                        .requestMatchers("/api/ws").permitAll()

                        // 상담사만 가능
                        .requestMatchers("/api/user/consultant/change-pwd", "/api/user/consultant/get-child",
                                "/api/user/consultant/email-check","/api/user/consultant/search-child/",
                                "/api/user/consultant/get-my-children", "/api/user/consultant/modify-child",
                                "/api/user/consultant/register-parent-account", "/api/user/consultant/my-profile").hasRole("CONSULTANT")
                        .requestMatchers("/api/user/delete/approve", "/api/user/delete/reject", "/api/user/delete/get-my-delete").hasRole("CONSULTANT")
                        .requestMatchers("/api/faq/write", "/api/faq/delete/", "/api/faq/update").hasRole("CONSULTANT")
                        .requestMatchers("/api/notice/write","/api/notice/delete/","/api/notice/update").hasRole("CONSULTANT")
                        .requestMatchers("/api/qna/write-qna-comment","/api/qna/update-comment","/api/qna/delete-comment/").hasRole("CONSULTANT")
                        .requestMatchers("/api/schedule/create","/api/schedule/update","/api/schedule/delete/",
                                "/api/schedule/list-by-date","/api/schedule/available-times").hasRole("CONSULTANT")

                        // 학부모만 가능
                        .requestMatchers("/api/user/parent/change-pwd","/api/user/parent/my-page",
                                "/api/user/parent/my-children").hasRole("PARENT")
                        .requestMatchers("/api/qna/write","/api/qna/update").hasRole("PARENT")
                        .requestMatchers("/api/chatbot/save").hasRole("PARENT")
                        .requestMatchers("/api/user/delete/request").hasRole("PARENT")
                        .requestMatchers("/api/game/start-game-chapter","/api/game/start-game-stage",
                                "/api/game/end-game-chapter","/api/game/save-log").hasRole("PARENT")
                        .requestMatchers("/api/study/start-study-chapter","/api/study/start-study-stage",
                                "/api/study/end-study-chapter","/api/study/save-log").hasRole("PARENT")
                        .requestMatchers("/api/schedule/list-by-parent","/api/schedule/dates-by-parent").hasRole("PARENT")

                        // 인증된 사용자 전부 가능
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            ConsultantCustomUserDetailService consultantCustomUserDetailService,
            ParentCustomUserDetailService parentCustomUserDetailService,
            PasswordEncoder passwordEncoder
    ) {
        DaoAuthenticationProvider consultantProvider = new DaoAuthenticationProvider();
        consultantProvider.setUserDetailsService(consultantCustomUserDetailService);
        consultantProvider.setPasswordEncoder(passwordEncoder);
        consultantProvider.setHideUserNotFoundExceptions(false);  // 추가

        DaoAuthenticationProvider parentProvider = new DaoAuthenticationProvider();
        parentProvider.setUserDetailsService(parentCustomUserDetailService);
        parentProvider.setPasswordEncoder(passwordEncoder);
        parentProvider.setHideUserNotFoundExceptions(false);  // 추가

        return new ProviderManager(List.of(consultantProvider, parentProvider));
    }

}
