package com.h5.faq.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FaqSearchRequestDto {
    private String keyword;
    private int pageNumber = 0;
    private int pageSize = 10;

}
