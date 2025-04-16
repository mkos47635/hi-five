package com.h5.chatbot.service;

import com.h5.chatbot.dto.request.InsertChatbotRequestDto;
import com.h5.chatbot.dto.response.GetChatbotResponseDto;
import com.h5.chatbot.dto.response.GetChatbotDatesResponseDto;

import java.time.LocalDate;
import java.util.List;

public interface ChatbotService {
    String insertChatbot(InsertChatbotRequestDto insertChatbotRequestDto);

    GetChatbotDatesResponseDto getChatbotDates(int childUserId, int year, int month);

    GetChatbotResponseDto getChatbot(int childUserId, LocalDate date);
}
