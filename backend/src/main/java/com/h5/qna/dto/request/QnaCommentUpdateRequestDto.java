package com.h5.qna.dto.request;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class QnaCommentUpdateRequestDto {
    private int qnaCommentId;
    private String content;
}
