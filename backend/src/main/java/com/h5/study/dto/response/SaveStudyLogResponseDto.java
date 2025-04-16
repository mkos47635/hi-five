package com.h5.study.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SaveStudyLogResponseDto {
    private int studyVideoLogId;
    private int studyTextLogId;
}
