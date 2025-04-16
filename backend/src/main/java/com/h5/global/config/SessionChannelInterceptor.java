package com.h5.global.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

@Component
public class SessionChannelInterceptor implements ChannelInterceptor {

    private final StringRedisTemplate redisTemplate;

    @Autowired
    public SessionChannelInterceptor(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    private static final String USER_SESSION_KEY_PREFIX = "user:session:";

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor != null) {
            if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                String sessionId = accessor.getSessionId();
                if (accessor.getUser() != null) {
                    String username = accessor.getUser().getName(); // 예: 이메일
                    String redisKey = USER_SESSION_KEY_PREFIX + username;
                    redisTemplate.opsForValue().set(redisKey, sessionId);
                    System.out.println("User " + username + " connected with sessionId: " + sessionId);
                }
            } else if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
                String sessionId = accessor.getSessionId();
                if (accessor.getUser() != null) {
                    String username = accessor.getUser().getName();
                    String redisKey = USER_SESSION_KEY_PREFIX + username;
                    String storedSessionId = redisTemplate.opsForValue().get(redisKey);
                    if (sessionId.equals(storedSessionId)) {
                        redisTemplate.delete(redisKey);
                        System.out.println("User " + username + " disconnected with sessionId: " + sessionId);
                    }
                }
            }
        }
        return message;
    }

    // 다른 서비스에서 사용하기 위한 getter 메서드
    public String getSessionIdForUser(String username) {
        String redisKey = USER_SESSION_KEY_PREFIX + username;
        return redisTemplate.opsForValue().get(redisKey);
    }
}
