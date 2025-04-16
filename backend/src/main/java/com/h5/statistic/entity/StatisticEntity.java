package com.h5.statistic.entity;

import com.h5.child.entity.ChildUserEntity;
import com.h5.emotion.entity.EmotionEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Setter
@Getter
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor
@Builder
@Table(name = "statistic")
public class StatisticEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "statistic_id", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "rating", nullable = false)
    private Integer rating;

    @NotNull
    @Column(name = "trial_cnt", nullable = false)
    private Integer trialCnt;

    @NotNull
    @Column(name = "crt_cnt", nullable = false)
    private Integer crtCnt;

    @NotNull
    @Column(name = "stage_crt_rate_1", nullable = false, precision = 3, scale = 1)
    private BigDecimal stageCrtRate1;

    @NotNull
    @Column(name = "stage_crt_rate_2", nullable = false, precision = 3, scale = 1)
    private BigDecimal stageCrtRate2;

    @NotNull
    @Column(name = "stage_crt_rate_3", nullable = false, precision = 3, scale = 1)
    private BigDecimal stageCrtRate3;

    @NotNull
    @Column(name = "stage_crt_rate_4", nullable = false, precision = 3, scale = 1)
    private BigDecimal stageCrtRate4;

    @NotNull
    @Column(name = "stage_crt_rate_5", nullable = false, precision = 3, scale = 1)
    private BigDecimal stageCrtRate5;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "emotion_id", nullable = false)
    private EmotionEntity emotionEntity;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "child_user_id", nullable = false)
    private ChildUserEntity childUserEntity;

    @NotNull
    @Column(name = "stage_try_cnt_1", nullable = false)
    private Integer stageTryCnt1;

    @NotNull
    @Column(name = "stage_try_cnt_2", nullable = false)
    private Integer stageTryCnt2;

    @NotNull
    @Column(name = "stage_try_cnt_3", nullable = false)
    private Integer stageTryCnt3;

    @NotNull
    @Column(name = "stage_try_cnt_4", nullable = false)
    private Integer stageTryCnt4;

    @NotNull
    @Column(name = "stage_try_cnt_5", nullable = false)
    private Integer stageTryCnt5;

    @NotNull
    @Column(name = "stage_crt_cnt_1", nullable = false)
    private Integer stageCrtCnt1;

    @NotNull
    @Column(name = "stage_crt_cnt_2", nullable = false)
    private Integer stageCrtCnt2;

    @NotNull
    @Column(name = "stage_crt_cnt_3", nullable = false)
    private Integer stageCrtCnt3;

    @NotNull
    @Column(name = "stage_crt_cnt_4", nullable = false)
    private Integer stageCrtCnt4;

    @NotNull
    @Column(name = "stage_crt_cnt_5", nullable = false)
    private Integer stageCrtCnt5;

}
