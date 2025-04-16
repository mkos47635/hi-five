package com.h5.consultant.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ModifyChildRequestDto {
    private int childUserId;
    private String interest;
    private String additionalInfo;
}
