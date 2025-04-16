package com.h5.global.exception;

import org.springframework.http.HttpStatus;

public class BoardAccessDeniedException extends BoardException {
    public BoardAccessDeniedException(String boardType) {
        super("You do not have permission to create or modify this " + boardType, HttpStatus.FORBIDDEN);
    }
}
