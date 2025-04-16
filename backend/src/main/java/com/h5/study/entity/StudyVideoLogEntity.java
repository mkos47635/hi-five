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
@Table(name = "study_video_log")
public class StudyVideoLogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "study_log_id", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "f_happy", nullable = false, precision = 4, scale = 1)
    private BigDecimal fHappy;

    @NotNull
    @Column(name = "f_anger", nullable = false, precision = 4, scale = 1)
    private BigDecimal fAnger;

    @NotNull
    @Column(name = "f_sad", nullable = false, precision = 4, scale = 1)
    private BigDecimal fSad;

    @NotNull
    @Column(name = "f_panic", nullable = false, precision = 4, scale = 1)
    private BigDecimal fPanic;

    @NotNull
    @Column(name = "f_fear", nullable = false, precision = 4, scale = 1)
    private BigDecimal fFear;

    @NotNull
    @Column(name = "start_dttm", nullable = false)
    private LocalDateTime startDttm;

    @Column(name = "end_dttm")
    private LocalDateTime endDttm;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "child_study_stage_id", nullable = false)
    private ChildStudyStageEntity childStudyStageEntity;

}
