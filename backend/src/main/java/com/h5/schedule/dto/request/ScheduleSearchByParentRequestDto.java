package com.h5.schedule.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;
import java.time.YearMonth;

@Getter
@Builder
public class ScheduleSearchByParentRequestDto {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private int year;
    private int month;

    public YearMonth toYearMonth() {
        return YearMonth.of(year, month);
    }
}
