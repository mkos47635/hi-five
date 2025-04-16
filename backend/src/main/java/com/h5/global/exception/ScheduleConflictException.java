package com.h5.global.exception;

public class ScheduleConflictException extends RuntimeException {
  public ScheduleConflictException() {
    super("Schedule conflict detected");
  }
}
