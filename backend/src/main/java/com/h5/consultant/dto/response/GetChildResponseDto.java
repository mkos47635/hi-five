package com.h5.consultant.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class GetChildResponseDto {
    private int childUserId;
    private String profileImgUrl;
    private String childName;
    private int age;
    private String birth;
    private String gender;
    private String firstConsultDate;
    private String interest;
    private String additionalInfo;
    private String parentName;
    private String parentPhone;
    private String parentEmail;
}
