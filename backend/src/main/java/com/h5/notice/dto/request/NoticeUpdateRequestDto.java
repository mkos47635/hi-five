package com.h5.notice.dto.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NoticeUpdateRequestDto {
    private int Id;
    private String title;
    private String content;
}
