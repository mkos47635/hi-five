package com.h5.study.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StartStudyChapterRequsetDto {
    private int childUserId;
    private int studyChapterId;
}
