package com.h5.consultant.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class GetMyChildrenResponseDto {
    private int childUserID;
    private String profileImgUrl;
    private String childName;
    private String birth;
    private int age;
    private String parentName;
}
