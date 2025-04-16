package com.h5.chatbot.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ChatbotContinueResponseDto {
    private int messageIndex;
    private String sender;
    private String message;
}
