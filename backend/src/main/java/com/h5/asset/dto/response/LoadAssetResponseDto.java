package com.h5.asset.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoadAssetResponseDto {
    private int gameStageId;
    private int chapterId;
    private String gameVideo;
    private String[] options;
    private String[] optionImages;
    private String situation;
    private int answer;
    private String cardFront;
    private String cardBack;
}
