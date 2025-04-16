package com.h5.notice.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NoticeResponseDto {
    private int id;
    private String title;
    private String name;
    private int viewCnt;
    private String createDttm;

}
