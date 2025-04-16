package com.h5.faq.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FaqCreateRequestDto {
    private String title;
    private String faqAnswer;
    private String type;
}
