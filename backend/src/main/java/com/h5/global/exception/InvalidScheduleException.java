package com.h5.global.exception;

public class InvalidScheduleException extends RuntimeException {
    public InvalidScheduleException() {
        super("Schedule is not valid");
    }
}
