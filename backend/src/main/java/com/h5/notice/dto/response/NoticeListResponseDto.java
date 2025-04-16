package com.h5.notice.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NoticeListResponseDto {
    private List<NoticeResponseDto> notices; // 공지 리스트
    private PaginationResponseDto pagination; // 페이징 정보
}
