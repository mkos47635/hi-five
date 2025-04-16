package com.h5.notice.service;

import com.h5.notice.dto.request.*;
import com.h5.notice.dto.response.NoticeDetailResponseDto;
import com.h5.notice.dto.response.NoticeListResponseDto;
import com.h5.notice.dto.response.NoticeSaveResponseDto;

public interface NoticeService {

    // 전체 글 + 페이징
    NoticeListResponseDto findAll(NoticeSearchRequestDto noticeSearchRequestDto);

    // 제목으로 검색 + 페이징
    NoticeListResponseDto findByTitle(NoticeSearchRequestDto noticeSearchRequestDto);

    // 작성자로 검색 + 페이징
    NoticeListResponseDto findByName(NoticeSearchRequestDto noticeSearchRequestDto);

    // 상세글 보기
    NoticeDetailResponseDto findById(int noticeId);

    // 조회수 증가
    void updateViewCnt(int noticeId);

    // 글 등록
    NoticeSaveResponseDto createNotice(NoticeCreateRequestDto noticeCreateRequestDto);

    // 글 삭제
    NoticeSaveResponseDto deleteNotice(int noticeId);

    // 글 수정
    NoticeSaveResponseDto updateNotice(NoticeUpdateRequestDto noticeUpdateRequestDto);
}
