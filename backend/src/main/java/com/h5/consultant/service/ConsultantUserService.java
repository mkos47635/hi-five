package com.h5.consultant.service;

import com.h5.consultant.dto.request.ModifyChildRequestDto;
import com.h5.consultant.dto.request.RegisterParentAccountDto;
import com.h5.consultant.dto.response.*;
import com.h5.consultant.entity.ConsultantUserEntity;

import java.util.List;

public interface ConsultantUserService {

    // 핸드폰 번호로 이메일 찾기
    ConsultantUserEntity findId(String name, String phone);

    // 임시 비밀번호로 변경
    void updateToTempPwd(String name, String email);

    // 임시 비밀번호에서 입력한 비밀번호로 변경
    void updatePwd(String oldPwd, String newPwd);

    RegisterParentAccountResponseDto registerParentAccount(RegisterParentAccountDto registerParentAccountDto);

    List<GetMyChildrenResponseDto> getChildrenForAuthenticatedConsultant();

    GetChildResponseDto getChild(int childUserid);

    MyProfileResponseDto getMyProfile();

    EmailCheckResponseDto emailCheck(String email);

    List<SearchChildResponseDto> searchChild(String childUserName);

    ModifyChildResponseDto modifyChild(ModifyChildRequestDto modifyChildRequestDto);
}
