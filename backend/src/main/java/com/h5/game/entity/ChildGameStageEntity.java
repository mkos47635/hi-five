package com.h5.game.entity;

import com.h5.asset.entity.GameStageEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor
@Table(name = "child_game_stage")
public class ChildGameStageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "child_game_stage_id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "game_stage_id", nullable = false)
    private GameStageEntity gameStageEntity;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_chapter_id", nullable = false)
    private ChildGameChapterEntity childGameChapterEntity;

    @Builder.Default
    @OneToMany(mappedBy = "childGameStageEntity")
    private Set<GameLogEntity> gameLogEntities = new LinkedHashSet<>();

}