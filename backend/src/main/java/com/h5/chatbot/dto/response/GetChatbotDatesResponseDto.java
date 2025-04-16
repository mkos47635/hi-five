package com.h5.chatbot.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Setter
@Getter
@Builder
public class GetChatbotDatesResponseDto {
    private List<LocalDate> dateList;
}
