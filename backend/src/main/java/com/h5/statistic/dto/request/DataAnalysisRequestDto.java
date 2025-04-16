package com.h5.statistic.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class DataAnalysisRequestDto {
    private int childUserId;
}
