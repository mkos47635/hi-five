package com.h5.asset.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CardAssetResponseDto {
    private int stageId;
    private String cardFront;
    private String cardBack;

}
