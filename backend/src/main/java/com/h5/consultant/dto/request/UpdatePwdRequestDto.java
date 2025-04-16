package com.h5.consultant.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UpdatePwdRequestDto {
    private String oldPwd;
    private String newPwd;
}
