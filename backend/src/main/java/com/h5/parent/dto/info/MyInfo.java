package com.h5.parent.dto.info;

import lombok.*;

@Getter
@Setter
@Builder
public class MyInfo {
    private int parentId;
    private String name;
    private String phone;
    private String email;
}
