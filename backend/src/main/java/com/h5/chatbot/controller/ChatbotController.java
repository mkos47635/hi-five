package com.h5.chatbot.controller;

import com.h5.chatbot.dto.request.InsertChatbotRequestDto;
import com.h5.chatbot.service.ChatbotService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/chatbot")
public class ChatbotController {
    private final ChatbotService chatbotService;

    @Autowired
    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/save")
    public ResponseEntity<?> insertChatbot(@Valid @RequestBody InsertChatbotRequestDto insertChatbotRequestDto) {
        log.info("insert chatbot request: {}", insertChatbotRequestDto.toString());
        return ResponseEntity.ok(chatbotService.insertChatbot(insertChatbotRequestDto));
    }

    @GetMapping("/get-dates/chatbot")
    public ResponseEntity<?> getChatbotDates(@Valid @RequestParam int childUserId,
                                             @Valid @RequestParam int year,
                                             @Valid @RequestParam int month) {
        return ResponseEntity.ok(chatbotService.getChatbotDates(childUserId, year, month));
    }

    @GetMapping("/get-chatbot")
    public ResponseEntity<?> getChatbot(@Valid @RequestParam int childUserId,
                                        @Valid @RequestParam LocalDate date) {
        return ResponseEntity.ok(chatbotService.getChatbot(childUserId, date));
    }
}
