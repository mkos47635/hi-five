package com.h5.consultant.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegisterParentAccountDto {
    private String parentName;
    private String parentEmail;
    private String parentPhone;
    private String childName;
    private String childBirth;
    private String childGender;
    private String firstConsultDt;
    private String childInterest;
    private String childAdditionalInfo;
}
