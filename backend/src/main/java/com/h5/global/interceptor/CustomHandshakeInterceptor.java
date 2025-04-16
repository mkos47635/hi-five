package com.h5.global.interceptor;

import com.h5.global.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class CustomHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                   ServerHttpResponse response,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) throws Exception {
        if (request instanceof ServletServerHttpRequest) {
            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
            // 클라이언트가 "accessToken" 파라미터로 JWT를 전달한다고 가정합니다.
            String tokenParam = servletRequest.getServletRequest().getParameter("accessToken");
            if (tokenParam != null && tokenParam.startsWith("Bearer ")) {
                String token = tokenParam.substring("Bearer ".length());
                if (jwtUtil.validateToken(token)) {
                    // 토큰이 유효하면, 사용자 이메일 등 식별 정보를 추출하여 attributes에 저장
                    String userEmail = jwtUtil.getEmailFromToken(token);
                    attributes.put("userEmail", userEmail);
                    return true;
                } else {
                    // 토큰이 유효하지 않은 경우 연결 거부
                    return false;
                }
            } else {
                // 토큰 파라미터가 없거나 형식이 올바르지 않은 경우 연결 거부
                return false;
            }
        }
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request,
                               ServerHttpResponse response,
                               WebSocketHandler wsHandler,
                               Exception exception) {
        // 필요 시 후처리 로직 추가
    }
}
