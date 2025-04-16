package com.h5.file.dto.request;

import com.h5.file.entity.FileEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class FileUploadRequestDto {
    private List<FileEntity.TblType> tblType;  // 여러 개의 테이블 타입
    private List<Integer> tblId;  // 여러 개의 테이블 ID
}

