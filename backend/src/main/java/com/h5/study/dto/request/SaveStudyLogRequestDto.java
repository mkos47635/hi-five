package com.h5.study.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class SaveStudyLogRequestDto {
    private BigDecimal fHappy;
    private BigDecimal fAnger;
    private BigDecimal fSad;
    private BigDecimal fPanic;
    private BigDecimal fFear;
    private BigDecimal tHappy;
    private BigDecimal tAnger;
    private BigDecimal tSad;
    private BigDecimal tPanic;
    private BigDecimal tFear;
    private String stt;
    private BigDecimal textSimilarity;
    private int childGameStageId;
}