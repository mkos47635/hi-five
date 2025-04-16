package com.h5.qna.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QnaAnswerResponseDto {
    private int id;
    private String content;
    private String createDttm;
    private String name;
    private String profileImageUrl;
}
