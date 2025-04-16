package com.h5.global.config;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

public class CustomHandshakeHandler extends DefaultHandshakeHandler {

    @Override
    protected Principal determineUser(
            ServerHttpRequest request,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) {
        // CustomHandshakeInterceptor에서 put해준 userEmail을 꺼낸다.
        String userEmail = (String) attributes.get("userEmail");
        if (userEmail == null) {
            return null;
        }
        // Principal 구현체를 하나 만들어 반환
        return new StompPrincipal(userEmail);
    }

    // Principal 구현체
    private static class StompPrincipal implements Principal {
        private final String name;
        public StompPrincipal(String name) {
            this.name = name;
        }
        @Override
        public String getName() {
            return name;
        }
    }
}
