package com.h5.parent.dto.info;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ConsultantInfo {
    private int consultantId;
    private String consultantName;
    private String consultantPhone;
    private String consultantEmail;
    private String centerName;
    private String centerPhone;
}
