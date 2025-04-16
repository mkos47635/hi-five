package com.h5.chatbot.service;

import com.h5.chatbot.document.ChatBotDocument;
import com.h5.chatbot.dto.request.InsertChatbotRequestDto;
import com.h5.chatbot.repository.ChatbotRepository;
import com.h5.chatbot.dto.response.GetChatbotResponseDto;
import com.h5.chatbot.dto.response.GetChatbotDatesResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ChatbotServiceImpl implements ChatbotService {

    private final ChatbotRepository chatbotRepository;

    @Autowired
    public ChatbotServiceImpl(ChatbotRepository chatbotRepository) {
        this.chatbotRepository = chatbotRepository;
    }


    @Override
    public String insertChatbot(InsertChatbotRequestDto insertChatbotRequestDto) {
        chatbotRepository.saveAll(insertChatbotRequestDto.getChatbotDocumentList().stream()
                        .map(chatbot -> ChatBotDocument.builder()
                                .childUserId(chatbot.getChildUserId())
                                .chatBotUseDttm(LocalDateTime.now())
                                .sender(chatbot.getSender())
                                .messageIndex(chatbot.getMessageIndex())
                                .message(chatbot.getMessage())
                                .build())
                        .toList()
        );

        return "Success store chatbot data";
    }

    @Override
    public GetChatbotDatesResponseDto getChatbotDates(int childUserId, int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59);

        List<ChatBotDocument> chatbotDocList = chatbotRepository.findByChildUserIdAndChatBotUseDttmBetween(childUserId, startDate, endDate)
                .orElseThrow(NoSuchElementException::new);

        return GetChatbotDatesResponseDto.builder()
                .dateList(chatbotDocList.stream()
                        .map(chatbot -> chatbot.getChatBotUseDttm().toLocalDate())
                        .distinct()
                        .sorted()
                        .collect(Collectors.toList()))
                .build();
    }

    @Override
    public GetChatbotResponseDto getChatbot(int childUserId, LocalDate date) {
        LocalDateTime startDate = date.atStartOfDay();
        LocalDateTime endDate = date.atTime(23, 59, 59);

        List<ChatBotDocument> chatBotDocumentList = chatbotRepository.findByChildUserIdAndChatBotUseDttmBetween(childUserId,startDate,endDate)
                .orElseThrow(NoSuchElementException::new);

        return GetChatbotResponseDto.builder()
                .chatBotDocumentList(chatBotDocumentList)
                .build();
    }

}
