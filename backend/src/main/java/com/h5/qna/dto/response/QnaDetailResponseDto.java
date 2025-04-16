package com.h5.qna.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QnaDetailResponseDto {
    private int id;
    private String title;
    private String content;
    private String name;
    private String createDttm;
    private int answerCnt;
    private String DeleteDttm;

    private List<QnaAnswerResponseDto> qnaAnswerResponseList;
}
