package com.h5.chatbot.repository;

import com.h5.chatbot.document.ChatBotDocument;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatbotRepository extends MongoRepository<ChatBotDocument, String> {
    Optional<List<ChatBotDocument>> findByChildUserIdAndChatBotUseDttmBetween(@NotNull Integer childUserId, LocalDateTime chatBotUseDttmStart, LocalDateTime chatBotUseDttmEnd);

    Optional<List<ChatBotDocument>> findByChatbotIdOrderByMessageIndexAsc(@NotNull String chatbotId);
}
