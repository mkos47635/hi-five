package com.h5.qna.dto.request;

import lombok.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QnaCreateRequestDto {
    private String title;
    private String content;
}
