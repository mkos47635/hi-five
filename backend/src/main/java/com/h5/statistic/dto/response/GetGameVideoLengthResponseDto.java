package com.h5.statistic.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class GetGameVideoLengthResponseDto {
    private int tryIndex;
    private int gameLogId;
}
