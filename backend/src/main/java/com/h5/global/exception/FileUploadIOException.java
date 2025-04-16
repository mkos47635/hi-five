package com.h5.global.exception;

public class FileUploadIOException extends RuntimeException {

    public FileUploadIOException() {
        super("Failed to upload file due to an IO error.");
    }

    public FileUploadIOException(String message) {
        super(message);
    }

    public FileUploadIOException(String message, Throwable cause) {
        super(message, cause);
    }
}

