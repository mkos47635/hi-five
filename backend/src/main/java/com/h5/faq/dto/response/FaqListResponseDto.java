package com.h5.faq.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FaqListResponseDto {
    private List<FaqResponseDto> faqs;
    private PaginationResponseDto pagination;
}
