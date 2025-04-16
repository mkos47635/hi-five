package com.h5.deleterequest.dto.response;

import com.h5.deleterequest.entity.DeleteUserRequestEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class DeleteUserRequestAprproveResponseDto {
    private int deleteRequestId;
    private DeleteUserRequestEntity.Status status;
    private String deleteConfirmDttm;
}
