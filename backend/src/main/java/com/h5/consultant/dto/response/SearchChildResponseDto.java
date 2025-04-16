package com.h5.consultant.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class SearchChildResponseDto {
    private int childUserId;
    private String childProfileUrl;
    private String childUserName;
    private String parentUserName;
    private String parentUserEmail;
}
