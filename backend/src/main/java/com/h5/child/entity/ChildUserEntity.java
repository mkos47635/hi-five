package com.h5.child.entity;

import com.h5.consultant.entity.ConsultantUserEntity;
import com.h5.game.entity.ChildGameChapterEntity;
import com.h5.game.entity.GameLogEntity;
import com.h5.parent.entity.ParentUserEntity;
import com.h5.statistic.entity.StatisticEntity;
import com.h5.study.entity.ChildStudyChapterEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "child_user")
public class ChildUserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "child_user_id", nullable = false)
    private Integer id;

    @NotNull
    @Lob
    @Column(name = "interest", nullable = false)
    private String interest;

    @NotNull
    @Column(name = "first_consult_dt", nullable = false)
    private LocalDate firstConsultDt;

    @NotNull
    @Column(name = "birth", nullable = false)
    private LocalDate birth;

    @Lob
    @Column(name = "gender")
    private String gender;

    @Lob
    @Column(name = "additional_info")
    private String additionalInfo;

    @Column(name = "clear_chapter")
    private Integer clearChapter;

    @Size(max = 10)
    @NotNull
    @Column(name = "name", nullable = false, length = 10)
    private String name;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "parent_user_id", nullable = false)
    private ParentUserEntity parentUserEntity;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "consultant_user_id", nullable = false)
    private ConsultantUserEntity consultantUserEntity;

    @Column(name = "delete_dttm")
    private String deleteDttm;

    @Builder.Default
    @OneToMany(mappedBy = "childUserEntity")
    private Set<ChildGameChapterEntity> childGameChapterEntities = new LinkedHashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "childUserEntity")
    private Set<ChildStudyChapterEntity> childStudyChapterEntities = new LinkedHashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "childUserEntity")
    private Set<GameLogEntity> gameLogEntities = new LinkedHashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "childUserEntity")
    private Set<StatisticEntity> statisticEntities = new LinkedHashSet<>();

}