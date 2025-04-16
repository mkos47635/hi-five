package com.h5.notice.controller;

import com.h5.notice.dto.request.NoticeCreateRequestDto;
import com.h5.notice.dto.request.NoticeSearchRequestDto;
import com.h5.notice.dto.request.NoticeUpdateRequestDto;
import com.h5.notice.dto.response.NoticeDetailResponseDto;
import com.h5.notice.dto.response.NoticeListResponseDto;
import com.h5.notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Slf4j
@RestController
@RequestMapping("/notice")
@RequiredArgsConstructor
@Tag(name = "공지사항 API", description = "공지사항 관련 API")
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping("/list")
    @Operation(summary = "공지 목록 조회", description = "삭제되지 않은 공지사항 목록을 페이징 형태로 반환합니다.")
    public ResponseEntity<NoticeListResponseDto> findAll(@ModelAttribute NoticeSearchRequestDto noticeSearchRequestDto) {
        return ResponseEntity.ok(noticeService.findAll(noticeSearchRequestDto));
    }

    @GetMapping("/search-by-title")
    @Operation(summary = "공지사항 제목 검색", description = "제목으로 검색한 공지사항 목록을 페이징 형태로 반환합니다.")
    public ResponseEntity<NoticeListResponseDto> findByTitle(@ModelAttribute NoticeSearchRequestDto noticeSearchRequestDto) {
        return ResponseEntity.ok(noticeService.findByTitle(noticeSearchRequestDto));
    }

    @GetMapping("/search-by-writer")
    @Operation(summary = "공지사항 작성자로 검색", description = "작성자로 검색한 공지사항 목록을 페이징 형태로 반환합니다.")
    public ResponseEntity<NoticeListResponseDto> findByName(@ModelAttribute NoticeSearchRequestDto noticeSearchRequestDto) {
        return ResponseEntity.ok(noticeService.findByName(noticeSearchRequestDto));
    }

    @GetMapping("/{noticeId}")
    @Operation(summary = "공지사항 글 상세", description = "공지사항 글 상세내용을 조회합니다.")
    public ResponseEntity<NoticeDetailResponseDto> findByNoticeId(@PathVariable int noticeId) {
        return ResponseEntity.ok(noticeService.findById(noticeId));
    }

    @PostMapping("/write")
    @Operation(summary = "공지사항 작성", description = "새로운 공지사항을 생성합니다.")
    public ResponseEntity<?> createNotice(@RequestBody NoticeCreateRequestDto noticeCreateRequestDto) {
        return ResponseEntity.ok(noticeService.createNotice(noticeCreateRequestDto));
    }

    @PostMapping("/delete/{noticeId}")
    @Operation(summary = "공지사항 삭제", description = "특정 공지사항 글을 삭제합니다.")
    public ResponseEntity<?> deleteNotice(@PathVariable int noticeId) {
        return ResponseEntity.ok(noticeService.deleteNotice(noticeId));
    }

    @PutMapping("/update")
    @Operation(summary = "공지사항 업데이트", description = "기존 공지사항을 수정합니다.")
    public ResponseEntity<?> updateNotice(@RequestBody NoticeUpdateRequestDto noticeUpdateRequestDto) {
        return ResponseEntity.ok(noticeService.updateNotice(noticeUpdateRequestDto));
    }
}
