package com.h5.deleterequest.dto.response;

import com.h5.deleterequest.entity.DeleteUserRequestEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class DeleteRequestResponseDto {
    private int deleteRequestId;
    private DeleteUserRequestEntity.Status status;
    private String deleteRequestDttm;
    private boolean duplicate;
}
