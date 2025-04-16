package com.h5.global.exception;

import lombok.Getter;

//사용자가 권한이 없는 작업을 시도할 때 발생 403
@Getter
public class UserAccessDeniedException extends RuntimeException {

    public UserAccessDeniedException() {
        super("Access denied for the current user");
    }

}
