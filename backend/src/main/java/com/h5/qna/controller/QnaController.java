package com.h5.qna.controller;

import com.h5.qna.dto.request.*;
import com.h5.qna.dto.response.QnaDetailResponseDto;
import com.h5.qna.dto.response.QnaListResponseDto;
import com.h5.qna.service.QnaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/qna")
@RequiredArgsConstructor
@Tag(name = "QnA API", description = "QnA 관련 API")
public class QnaController {

    private final QnaService qnaService;

    @GetMapping("/list")
    @Operation(summary = "QnA 목록 조회", description = "삭제되지 않은 QnA 목록을 페이징 형태로 반환합니다.")
    public ResponseEntity<?> findAll(@ModelAttribute QnaSearchRequestDto qnaSearchRequestDto) {
        QnaListResponseDto qnaResponseDto = qnaService.findAll(qnaSearchRequestDto);
        return ResponseEntity.ok(qnaResponseDto);
    }

    @GetMapping("/search-by-title")
    @Operation(summary = "QnA 제목 검색", description = "제목으로 검색한 QnA 목록을 페이징 형태로 반환합니다.")
    public ResponseEntity<?> findByTitle(@ModelAttribute QnaSearchRequestDto qnaSearchRequestDto) {
        QnaListResponseDto qnaResponseDto = qnaService.findByTitle(qnaSearchRequestDto);
        return ResponseEntity.ok(qnaResponseDto);
    }

    @GetMapping("/search-by-writer")
    @Operation(summary = "QnA 작성자로 검색", description = "작성자로 검색한 QnA 목록을 페이징 형태로 반환합니다.")
    public ResponseEntity<?> findByName(@ModelAttribute QnaSearchRequestDto qnaSearchRequestDto) {
        QnaListResponseDto qnaResponseDto = qnaService.findByName(qnaSearchRequestDto);
        return ResponseEntity.ok(qnaResponseDto);
    }

    @GetMapping("/{qnaId}")
    @Operation(summary = "QnA 글 상세", description = "QnA 글 상세내용을 조회합니다.")
    public ResponseEntity<?> findByQnaId(@PathVariable int qnaId) {
        QnaDetailResponseDto qnaDetailResponseDto = qnaService.findById(qnaId);
        return ResponseEntity.ok(qnaDetailResponseDto);
    }

    @PostMapping("/write")
    @Operation(summary = "QnA 작성", description = "새로운 QnA를 생성합니다.")
    public ResponseEntity<?> createQna(@RequestBody QnaCreateRequestDto qnaCreateRequestDto) {
        return ResponseEntity.ok(qnaService.createQna(qnaCreateRequestDto));
    }

    @PostMapping("/write-qna-comment")
     public ResponseEntity<?> createComment(@RequestBody QnaCommentCreateRequestDto qnaCommentCreateRequestDto) {
        return ResponseEntity.ok(qnaService.createQnaComment(qnaCommentCreateRequestDto));
    }

    @PostMapping("/delete/{qnaId}")
    @Operation(summary = "QnA 삭제", description = "특정 QnA 글을 삭제합니다.")
    public ResponseEntity<?> deleteQna(@PathVariable int qnaId) {
        return ResponseEntity.ok(qnaService.deleteQna(qnaId));
    }

    @PutMapping("/update")
    @Operation(summary = "QnA 업데이트", description = "기존 QnA를 수정합니다.")
    public ResponseEntity<?> updateQna(@RequestBody QnaUpdateRequestDto qnaUpdateRequestDto) {
        return ResponseEntity.ok(qnaService.updateQna(qnaUpdateRequestDto));
    }

    @PutMapping("/update-comment")
    public ResponseEntity<?> updateComment(@RequestBody QnaCommentUpdateRequestDto qnaCommentUpdateRequestDto) {
        return ResponseEntity.ok(qnaService.updateComment(qnaCommentUpdateRequestDto));
    }

    @PutMapping("/delete-comment/{qnaCommentId}")
    public ResponseEntity<?> deleteComment(@PathVariable int qnaCommentId) {
        return ResponseEntity.ok(qnaService.deleteComment(qnaCommentId));
    }
}
