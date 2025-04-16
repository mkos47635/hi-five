package com.h5.session.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JoinSessionRequestDto {
    private int childId;
    private String type;
}
