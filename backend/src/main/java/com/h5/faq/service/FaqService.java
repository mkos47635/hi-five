package com.h5.faq.service;

import com.h5.faq.dto.request.FaqCreateRequestDto;
import com.h5.faq.dto.request.FaqSearchRequestDto;
import com.h5.faq.dto.request.FaqUpdateRequestDto;
import com.h5.faq.dto.response.FaqDetailResponseDto;
import com.h5.faq.dto.response.FaqListResponseDto;
import com.h5.faq.dto.response.FaqSaveResponseDto;


public interface FaqService {
    //c
    FaqSaveResponseDto createFaq(FaqCreateRequestDto faqCreateRequestDto);
    //r
    //전체
    FaqListResponseDto findAll(FaqSearchRequestDto faqSearchRequestDto);

    //제목
    FaqListResponseDto findByTitle(FaqSearchRequestDto faqSearchRequestDto);

    //작성자
    FaqListResponseDto findByEmail(FaqSearchRequestDto faqSearchRequestDto);

    FaqDetailResponseDto findById(int id);
    //u
    FaqSaveResponseDto updateFaq(FaqUpdateRequestDto faqUpdateRequestDto);

    //d
    FaqSaveResponseDto deleteFaq(int id);
}
