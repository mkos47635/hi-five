package com.h5.statistic.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Setter
@Getter
@Builder
public class GetGameVideoDatesResponseDto {
    private List<LocalDate> dateList;
}
