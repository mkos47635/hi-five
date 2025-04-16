package com.h5.parent.dto.info;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class MyChildInfo {
    private int childId;
    private String profileImgUrl;
    private String name;
    private int age;
    private String gender;
}
