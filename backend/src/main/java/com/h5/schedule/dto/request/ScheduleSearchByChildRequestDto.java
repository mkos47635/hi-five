package com.h5.schedule.dto.request;

import lombok.*;

import java.time.YearMonth;

@Getter
@Builder
public class ScheduleSearchByChildRequestDto {
    private int childId;
    private int year;
    private int month;

    public YearMonth toYearMonth() {
        return YearMonth.of(year, month);
    }
}
