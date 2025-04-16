package com.h5.global.exception;

public class ScheduleAlreadyDeletedException extends RuntimeException {
    public ScheduleAlreadyDeletedException() {
        super("Schedule already deleted");
    }
}
