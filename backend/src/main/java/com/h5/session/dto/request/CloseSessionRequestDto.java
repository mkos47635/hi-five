package com.h5.session.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CloseSessionRequestDto {
    private int schdlId;
    private String type;
}
