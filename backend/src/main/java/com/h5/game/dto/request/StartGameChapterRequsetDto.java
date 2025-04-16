package com.h5.game.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StartGameChapterRequsetDto {
    private int childUserId;
    private int gameChapterId;
}
