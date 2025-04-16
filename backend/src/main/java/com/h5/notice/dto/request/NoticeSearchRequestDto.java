package com.h5.notice.dto.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NoticeSearchRequestDto {
    private String keyword;
    private int pageNumber = 0;
    private int pageSize = 10;

}
