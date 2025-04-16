package com.h5.faq.controller;

import com.h5.faq.dto.request.FaqCreateRequestDto;
import com.h5.faq.dto.request.FaqSearchRequestDto;
import com.h5.faq.dto.request.FaqUpdateRequestDto;
import com.h5.faq.dto.response.FaqDetailResponseDto;
import com.h5.faq.dto.response.FaqListResponseDto;
import com.h5.faq.dto.response.FaqSaveResponseDto;
import com.h5.faq.service.FaqService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/faq")
@RequiredArgsConstructor
@Tag(name = "FAQ API", description = "FAQ 관련 API")
public class FaqController {

    private final FaqService faqService;

    @GetMapping("/list")
    @Operation(summary = "FAQ 목록 조회", description = "삭제되지 않은 FAQ 목록을 페이징 형태로 반환합니다.")
    public ResponseEntity<?> findAll(@ModelAttribute FaqSearchRequestDto faqSearchRequestDto) {
        FaqListResponseDto faqResponseDto = faqService.findAll(faqSearchRequestDto);
        return ResponseEntity.ok(faqResponseDto);
    }

    @GetMapping("/search-by-title")
    @Operation(summary = "FAQ 제목 검색", description = "제목으로 검색한 FAQ 목록을 페이징 형태로 반환합니다.")
    public ResponseEntity<?> findByTitle(@ModelAttribute FaqSearchRequestDto faqSearchRequestDto) {
        FaqListResponseDto faqResponseDto = faqService.findByTitle(faqSearchRequestDto);
        return ResponseEntity.ok(faqResponseDto);
    }

    @GetMapping("/search-by-writer")
    @Operation(summary = "FAQ 작성자로 검색", description = "작성자 이름로 검색한 FAQ 목록을 페이징 형태로 반환합니다.")
    public ResponseEntity<?> findByEmail(@ModelAttribute FaqSearchRequestDto faqSearchRequestDto) {
        FaqListResponseDto faqResponseDto = faqService.findByEmail(faqSearchRequestDto);
        return ResponseEntity.ok(faqResponseDto);
    }

    @GetMapping("/{faqId}")
    @Operation(summary = "FAQ 상세 조회", description = "FAQ의 상세 정보를 반환합니다.")
    public ResponseEntity<?> findByFaqId(@PathVariable int faqId) {
        FaqDetailResponseDto faqDetailResponseDto = faqService.findById(faqId);
        return ResponseEntity.ok(faqDetailResponseDto);
    }

    @PostMapping("/write")
    @Operation(summary = "FAQ 작성", description = "새로운 FAQ를 생성합니다.")
    public ResponseEntity<?> createFaq(@RequestBody FaqCreateRequestDto faqCreateRequestDto) {
        FaqSaveResponseDto faqSaveResponseDto = faqService.createFaq(faqCreateRequestDto);
        return ResponseEntity.ok(faqSaveResponseDto);
    }

    @PostMapping("/delete/{faqId}")
    @Operation(summary = "FAQ 삭제", description = "특정 FAQ 글을 삭제합니다.")
    public ResponseEntity<?> deleteFaq(@PathVariable int faqId) {
        return ResponseEntity.ok(faqService.deleteFaq(faqId));
    }

    @PutMapping("/update")
    @Operation(summary = "FAQ 업데이트", description = "기존 FAQ를 수정합니다.")
    public ResponseEntity<?> updateFaq(@RequestBody FaqUpdateRequestDto faqUpdateRequestDto) {
        FaqSaveResponseDto faqSaveResponseDto = faqService.updateFaq(faqUpdateRequestDto);
        return ResponseEntity.ok(faqSaveResponseDto);
    }
}
