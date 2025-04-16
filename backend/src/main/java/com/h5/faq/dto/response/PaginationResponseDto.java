package com.h5.faq.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaginationResponseDto {
    private int currentPage;
    private int pageSize;
    private int totalPages;
    private long totalElements;
}
