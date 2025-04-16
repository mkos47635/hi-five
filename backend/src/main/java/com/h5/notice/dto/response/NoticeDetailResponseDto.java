package com.h5.notice.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NoticeDetailResponseDto {
    private int id;
    private String title;
    private String content;
    private String name;
    private String createDttm;
    private int viewCnt;
    private String deleteDttm;
}
