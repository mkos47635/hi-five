package com.h5.deleterequest.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class GetMyDeleteChildResponseDto {

    private int childUserId;
    public String childName;
    private String childUserProfileUrl;
    public String gender;
    private int age;
    private String parentUserName;
    private String birth;
    private String parentUserPhone;
    private String parentUserEmail;
    private String firConsultDt;
    private String interest;
    private String additionalInfo;
}
