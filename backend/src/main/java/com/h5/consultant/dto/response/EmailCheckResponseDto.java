package com.h5.consultant.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmailCheckResponseDto {
    private boolean alreadyAccount;
    private String email;
    private String parentName;
    private String parentPhone;
}
