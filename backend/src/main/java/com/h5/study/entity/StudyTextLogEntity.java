package com.h5.study.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "study_text_log")
public class StudyTextLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "study_text_log_id", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "t_happy", nullable = false, precision = 4, scale = 1)
    private BigDecimal tHappy;

    @NotNull
    @Column(name = "t_anger", nullable = false, precision = 4, scale = 1)
    private BigDecimal tAnger;

    @NotNull
    @Column(name = "t_sad", nullable = false, precision = 4, scale = 1)
    private BigDecimal tSad;

    @NotNull
    @Column(name = "t_panic", nullable = false, precision = 4, scale = 1)
    private BigDecimal tPanic;

    @NotNull
    @Column(name = "t_fear", nullable = false, precision = 4, scale = 1)
    private BigDecimal tFear;

    @NotNull
    @Lob
    @Column(name = "stt", nullable = false)
    private String stt;

    @NotNull
    @Column(name = "start_dttm", nullable = false)
    private LocalDateTime startDttm;

    @Column(name = "end_dttm")
    private LocalDateTime endDttm;

    @NotNull
    @Column(name = "text_similarity", nullable = false, precision = 4, scale = 1)
    private BigDecimal textSimilarity;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "child_study_stage_id", nullable = false)
    private ChildStudyStageEntity childStudyStageEntity;

}