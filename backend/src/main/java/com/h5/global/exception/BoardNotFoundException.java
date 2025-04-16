package com.h5.global.exception;

import org.springframework.http.HttpStatus;

public class BoardNotFoundException extends BoardException {
    public BoardNotFoundException(String boardType) {
        super(boardType + " not found", HttpStatus.NOT_FOUND);
    }
}
