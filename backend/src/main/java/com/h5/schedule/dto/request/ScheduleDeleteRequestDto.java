package com.h5.schedule.dto.request;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ScheduleDeleteRequestDto {
    private int id;
    private String type;
}
