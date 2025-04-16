package com.h5.parent.service;

import com.h5.parent.dto.response.MyChildrenResponseDto;
import com.h5.parent.dto.response.MyPageResponseDto;
import com.h5.parent.entity.ParentUserEntity;

import java.util.List;

public interface ParentUserService {
    MyPageResponseDto getMyPageInfo();

    // 핸드폰 번호로 이메일 찾기
    ParentUserEntity findId(String name, String phone);

    // 임시 비밀번호로 변경
    void updateToTempPwd(String name, String email);

    // 임시 비밀번호에서 입력한 비밀번호로 변경
    void updatePwd(String oldPwd, String newPwd);

    List<MyChildrenResponseDto> myChildren();
}
