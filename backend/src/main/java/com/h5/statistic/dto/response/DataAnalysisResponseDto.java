package com.h5.statistic.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
@Builder
public class DataAnalysisResponseDto {

    private Integer childUserId;
    private String childName;
    private Integer emotionId;
    private Integer rating;
    private Integer totalTryCnt;
    private Integer totalCrtCnt;
    private BigDecimal stageCrtRate1;
    private BigDecimal stageCrtRate2;
    private BigDecimal stageCrtRate3;
    private BigDecimal stageCrtRate4;
    private BigDecimal stageCrtRate5;
    private Integer stageTryCnt1;
    private Integer stageTryCnt2;
    private Integer stageTryCnt3;
    private Integer stageTryCnt4;
    private Integer stageTryCnt5;
    private Integer stageCrtCnt1;
    private Integer stageCrtCnt2;
    private Integer stageCrtCnt3;
    private Integer stageCrtCnt4;
    private Integer stageCrtCnt5;

}
