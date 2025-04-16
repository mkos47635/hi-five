package com.h5.asset.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetStageResponseDto {
    private int chapter;
    private int stage;
}
