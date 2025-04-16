package com.h5.global.exception;

public class ScheduleNotFoundException extends RuntimeException {
    public ScheduleNotFoundException() {
        super("Can not find schedule");
    }
}
