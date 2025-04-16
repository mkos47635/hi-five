package com.h5.asset.dto.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoadAssetByStageDto {
    private int chapter;
    private int stage;
}
