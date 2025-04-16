package com.h5.chatbot.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.h5.chatbot.document.ChatBotDocument;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InsertChatbotRequestDto {
    @NotNull
    @NotEmpty
    @JsonProperty("chatbotDocumentList")
    private List<ChatBotDocument> chatbotDocumentList;
}
