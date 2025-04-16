package com.h5.deleterequest.service;

import com.h5.deleterequest.dto.response.DeleteRequestResponseDto;
import com.h5.deleterequest.dto.response.DeleteUserRequestAprproveResponseDto;
import com.h5.deleterequest.dto.response.DeleteUserRequestRejectResponseDto;
import com.h5.deleterequest.dto.response.GetMyDeleteResponseDto;

import java.util.List;

public interface DeleteUserRequestService {
    // 탈퇴 요청
    DeleteRequestResponseDto deleteRequest();

    // 탈퇴 승인
    DeleteUserRequestAprproveResponseDto deleteApprove(int deleteUserRequestId);

    // 탈퇴 거절
    DeleteUserRequestRejectResponseDto deleteReject(int deleteUserRequestId);

    // 내 탈퇴 요청 리스트
    List<GetMyDeleteResponseDto> getMyDelete();
}
