package com.h5.qna.dto.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QnaSearchRequestDto {
    private String keyword;

    @Builder.Default
    private int pageNumber = 0;

    @Builder.Default
    private int pageSize = 10;
}
