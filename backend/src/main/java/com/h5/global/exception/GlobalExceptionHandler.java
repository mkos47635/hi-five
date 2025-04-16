package com.h5.global.exception;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;

import lombok.Getter;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.converter.MessageConversionException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindException;
import org.springframework.web.HttpMediaTypeException;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.messaging.simp.stomp.StompConversionException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @Setter
    @Getter
    private static class ErrorResponse {
        private final String status;
        private final String message;

        public ErrorResponse(String status, String message) {
            this.status = status;
            this.message = message;
        }

    }

    // =========================
    // Custom Exception 관련 예외 처리
    // =========================

    private ResponseEntity<ErrorResponse> buildErrorResponse(String message, String errorCode, HttpStatus status) {
        ErrorResponse errorResponse = new ErrorResponse(errorCode, message);
        return new ResponseEntity<>(errorResponse, status);
    }

    // BoardAccessDeniedException -> 403 Forbidden
    @ExceptionHandler(BoardAccessDeniedException.class)
    public ResponseEntity<?> handleBoardAccessDeniedException(BoardAccessDeniedException e) {
        log.warn("Board access denied", e);
        return buildErrorResponse(e.getMessage(), "BOARD_ACCESS_DENIED", HttpStatus.FORBIDDEN);
    }

    // BoardNotFoundException -> 404 Not Found
    @ExceptionHandler(BoardNotFoundException.class)
    public ResponseEntity<?> handleBoardNotFoundException(BoardNotFoundException e) {
        log.warn("Board not found", e);
        return buildErrorResponse(e.getMessage(), "BOARD_NOT_FOUND", HttpStatus.NOT_FOUND);
    }

    // BoardException -> 400 Bad Request
    @ExceptionHandler(BoardException.class)
    public ResponseEntity<?> handleBoardException(BoardException e) {
        log.warn("Board exception", e);
        return buildErrorResponse(e.getMessage(), "BOARD_ERROR", HttpStatus.BAD_REQUEST);
    }

    // FileNotFoundException -> 404 Not Found
    @ExceptionHandler(FileNotFoundException.class)
    public ResponseEntity<?> handleFileNotFoundException(FileNotFoundException e) {
        log.warn("File not found", e);
        return buildErrorResponse(e.getMessage(), "FILE_NOT_FOUND", HttpStatus.NOT_FOUND);
    }

    // FileDeleteException -> 500 Internal Server Error
    @ExceptionHandler(FileDeleteException.class)
    public ResponseEntity<?> handleFileDeleteException(FileDeleteException e) {
        log.warn("File delete exception", e);
        return buildErrorResponse("Server internal error occur", "FILE_DELETE_IO_ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // FileUploadIOException -> 500 Internal Server Error
    @ExceptionHandler(FileUploadIOException.class)
    public ResponseEntity<?> handleFileUploadIOException(FileUploadIOException e) {
        log.warn("File upload exception", e);
        return buildErrorResponse("Server internal error occur", "FILE_UPLOAD_IO_ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // GameLogNotFoundException -> 404 Not Found
    @ExceptionHandler(GameLogNotFoundException.class)
    public ResponseEntity<?> handleGameLogNotFoundException(GameLogNotFoundException e) {
        log.warn("Game log not found", e);
        return buildErrorResponse(e.getMessage(), "GAME_LOG_NOT_FOUND", HttpStatus.NOT_FOUND);
    }

    // GameNotFoundException -> 404 Not Found
    @ExceptionHandler(GameNotFoundException.class)
    public ResponseEntity<?> handleGameNotFoundException(GameNotFoundException e) {
        log.warn("Game not found", e);
        return buildErrorResponse(e.getMessage(), "GAME_NOT_FOUND", HttpStatus.NOT_FOUND);
    }

    // InvalidJwtTokenException -> 401 Unauthorized
    @ExceptionHandler(InvalidJwtTokenException.class)
    public ResponseEntity<?> handleInvalidJwtTokenException(InvalidJwtTokenException e) {
        log.warn("Invalid jwt token", e);
        return buildErrorResponse(e.getMessage(), "INVALID_JWT_TOKEN", HttpStatus.UNAUTHORIZED);
    }

    // ExpiredJwtTokenException - 401 Unauthorized
    @ExceptionHandler(com.h5.global.exception.ExpiredJwtException.class)
    public ResponseEntity<?> handleExpiredJwtException(ExpiredJwtException e) {
        log.warn("Expired jwt token", e);
        return buildErrorResponse(e.getMessage(), "EXPIRED_JWT_TOKEN", HttpStatus.UNAUTHORIZED);
    }

    // InvalidUserException -> 400 Bad Request
    @ExceptionHandler(InvalidUserException.class)
    public ResponseEntity<?> handleInvalidUserException(InvalidUserException e) {
        log.warn("Invalid user", e);
        return buildErrorResponse(e.getMessage(), "INVALID_USER", HttpStatus.BAD_REQUEST);
    }

    // MailSendException -> 500 Internal Server Error
    @ExceptionHandler(MailSendException.class)
    public ResponseEntity<?> handleMailSend(MailSendException e) {
        log.error("Mail sending error", e);
        return buildErrorResponse("Server internal error occur", "MAIL_SEND_ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // InvalidScheduleException -> 400 Bad Request
    @ExceptionHandler(InvalidScheduleException.class)
    public ResponseEntity<?> handleInvalidSchedule(InvalidScheduleException e) {
        log.warn("Invalid schedule", e);
        return buildErrorResponse(e.getMessage(), "INVALID_SCHEDULE", HttpStatus.BAD_REQUEST);
    }

    // ScheduleAlreadyDeletedException -> 409 Conflict
    @ExceptionHandler(ScheduleAlreadyDeletedException.class)
    public ResponseEntity<?> handleScheduleAlreadyDeleted(ScheduleAlreadyDeletedException e) {
        log.warn("Schedule already deleted", e);
        return buildErrorResponse(e.getMessage(), "SCHEDULE_ALREADY_DELETED", HttpStatus.CONFLICT);
    }

    // ScheduleConflictException -> 409 Conflict
    @ExceptionHandler(ScheduleConflictException.class)
    public ResponseEntity<?> handleScheduleConflict(ScheduleConflictException e) {
        log.warn("Schedule conflict", e);
        return buildErrorResponse(e.getMessage(), "SCHEDULE_CONFLICT", HttpStatus.CONFLICT);
    }

    // ScheduleNotFoundException -> 404 Not Found
    @ExceptionHandler(ScheduleNotFoundException.class)
    public ResponseEntity<?> handleScheduleNotFound(ScheduleNotFoundException e) {
        log.warn("Schedule not found", e);
        return buildErrorResponse(e.getMessage(), "SCHEDULE_NOT_FOUND", HttpStatus.NOT_FOUND);
    }

    // StatisticNotFoundException -> 404 Not Found
    @ExceptionHandler(StatisticNotFoundException.class)
    public ResponseEntity<?> handleStatisticNotFound(StatisticNotFoundException e) {
        log.warn("Statistic not found", e);
        return buildErrorResponse(e.getMessage(), "STATISTIC_NOT_FOUND", HttpStatus.NOT_FOUND);
    }

    // UserAccessDeniedException -> 403 Forbidden
    @ExceptionHandler(UserAccessDeniedException.class)
    public ResponseEntity<?> handleUserAccessDenied(UserAccessDeniedException e) {
        log.warn("User access denied", e);
        return buildErrorResponse(e.getMessage(), "USER_ACCESS_DENIED", HttpStatus.FORBIDDEN);
    }

    // UserNotFoundException -> 404 Not Found
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> handleUserNotFound(UserNotFoundException e) {
        log.warn("User not found", e);
        return buildErrorResponse(e.getMessage(), "USER_NOT_FOUND", HttpStatus.NOT_FOUND);
    }

    // =========================
    // Spring Boot 관련 예외 처리
    // =========================

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<?> handleMethodNotSupported(HttpRequestMethodNotSupportedException e) {
        log.warn("HTTP method not supported", e);
        return buildErrorResponse("Not supported HTTP method", "METHOD_NOT_ALLOWED", HttpStatus.METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler(HttpMediaTypeException.class)
    public ResponseEntity<?> handleHttpMediaTypeException(HttpMediaTypeException e) {
        log.warn("HTTP media type exception", e);
        return buildErrorResponse("Not supported HTTP media type", "MEDIA_TYPE_ERROR", HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<?> handleMissingServletRequestParameterException(MissingServletRequestParameterException e) {
        log.warn("Missing servlet request parameter", e);
        return buildErrorResponse("Missing servlet request parameter", "MISSING_REQUEST_PARAMETER", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
        log.warn("Http message not readable", e);
        return buildErrorResponse("Http message not readable", "INVALID_REQUEST", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMediaTypeNotAcceptableException.class)
    public ResponseEntity<?> handleHttpMediaTypeNotAcceptableException(HttpMediaTypeNotAcceptableException e) {
        log.warn("HTTP media type not acceptable", e);
        return buildErrorResponse("Not acceptable HTTP media type.", "MEDIA_TYPE_NOT_ACCEPTABLE", HttpStatus.NOT_ACCEPTABLE);
    }

    // MethodArgumentNotValidException and BindException -> 400 Bad Request
    @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class})
    public ResponseEntity<?> handleValidationException(Exception e) {
        log.warn("Validation error", e);
        return buildErrorResponse("Validation failed for the request.", "VALIDATION_ERROR", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<?> handleMissingServletRequestPartException(MissingServletRequestPartException e) {
        log.warn("Missing servlet request part", e);
        return buildErrorResponse("Missing servlet request part.", "MISSING_REQUEST_PART", HttpStatus.BAD_REQUEST);
    }

    // =========================
    // Spring Security 관련 예외 처리
    // =========================

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<?> handleAuthenticationException(AuthenticationException e) {
        log.warn("Authentication error", e);
        return buildErrorResponse("Authentication error occur", "AUTHENTICATION_ERROR", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDenied(AccessDeniedException e) {
        log.warn("Access denied", e);
        return buildErrorResponse("Access denied", "ACCESS_DENIED", HttpStatus.FORBIDDEN);
    }

    // =========================
    // STOMP/WebSocket 관련 예외 처리
    // =========================

    @ExceptionHandler(StompConversionException.class)
    public ResponseEntity<?> handleStompConversionException(StompConversionException ex) {
        log.warn("STOMP message conversion error", ex);
        return buildErrorResponse("Failed to convert STOMP message.", "STOMP_CONVERSION_ERROR", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({MessagingException.class, MessageDeliveryException.class, MessageConversionException.class})
    public ResponseEntity<?> handleMessagingException(Exception ex) {
        log.warn("Messaging processing error", ex);
        return buildErrorResponse("An error occurred while processing the message.", "MESSAGING_ERROR", HttpStatus.BAD_REQUEST);
    }

    // =========================
    // JWT 관련 예외 처리
    // =========================

    @ExceptionHandler({MalformedJwtException.class, SignatureException.class, UnsupportedJwtException.class, JwtException.class})
    public ResponseEntity<?> handleJwtException(Exception e) {
        log.warn("Invalid JWT token", e);
        return buildErrorResponse("Invalid JWT token.", "JWT_INVALID", HttpStatus.UNAUTHORIZED);
    }

    // =========================
    // 그 외 모든 예외 처리 (Fallback)
    // =========================

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception e) {
        log.error("Unhandled exception", e);
        return buildErrorResponse("An unknown error occurred. Please try again.", "INTERNAL_SERVER_ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
