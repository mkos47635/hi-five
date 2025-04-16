package com.h5.game.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateChildClearedStageRequestDto {
    private int childId;
    private int chapter;
    private int stage;
}
