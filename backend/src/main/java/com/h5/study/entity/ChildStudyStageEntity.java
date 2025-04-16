package com.h5.study.entity;

import com.h5.asset.entity.GameStageEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "child_study_stage")
public class ChildStudyStageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "child_study_stage_id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "game_stage_id", nullable = false)
    private GameStageEntity gameStageEntity;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "child_study_chapter_id", nullable = false)
    private ChildStudyChapterEntity childStudyChapterEntity;

    @NotNull
    @Column(name = "start_dttm", nullable = false)
    private LocalDateTime startDttm;

    @Column(name = "end_dttm")
    private LocalDateTime endDttm;

    @Builder.Default
    @OneToMany(mappedBy = "childStudyStageEntity")
    private Set<StudyTextLogEntity> studyTextLogEntities = new LinkedHashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "childStudyStageEntity")
    private Set<StudyVideoLogEntity> studyVideoLogEntities = new LinkedHashSet<>();

}