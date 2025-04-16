package com.h5.asset.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChapterAssetResponseDto {
    private int gameChapterId;
    private String title;
    private String chapterPic;
}
