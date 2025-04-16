package com.h5.qna.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaginationResponseDto {
    private int currentPage;
    private int pageSize;
    private int totalPages;
    private long totalElements;
}
