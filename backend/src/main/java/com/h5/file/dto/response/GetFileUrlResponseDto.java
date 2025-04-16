package com.h5.file.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class GetFileUrlResponseDto {
    private Integer fileId;
    private String url;
    private String fileName;
}
