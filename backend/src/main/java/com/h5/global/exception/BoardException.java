package com.h5.global.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public abstract class BoardException extends RuntimeException {
    private final HttpStatus status;

    public BoardException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

}
