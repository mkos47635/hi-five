package com.h5.faq.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FaqUpdateRequestDto {
    private int faqId;
    private String faqTitle;
    private String faqAnswer;
}
