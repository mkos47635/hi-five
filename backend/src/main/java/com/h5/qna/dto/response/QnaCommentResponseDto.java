package com.h5.qna.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class QnaCommentResponseDto {
    private int qnaAnswerId;
    private int qnaId;
}
