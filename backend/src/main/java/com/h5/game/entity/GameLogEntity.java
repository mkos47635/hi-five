package com.h5.game.entity;

import com.h5.asset.entity.GameStageEntity;
import com.h5.child.entity.ChildUserEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor
@Table(name = "game_log")
public class GameLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "game_log_id", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "selected_opt", nullable = false)
    private Integer selectedOpt;

    @Builder.Default
    @NotNull
    @Column(name = "corrected", nullable = false)
    private Boolean corrected = false;

    @NotNull
    @Column(name = "submit_dttm", nullable = false)
    private LocalDateTime submitDttm;

    @Builder.Default
    @NotNull
    @Column(name = "consulted", nullable = false)
    private Boolean consulted = false;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "child_game_stage_id", nullable = false)
    private ChildGameStageEntity childGameStageEntity;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "child_user_id", nullable = false)
    private ChildUserEntity childUserEntity;

    @OneToOne(mappedBy = "gameLogEntity")
    private AiLogEntity aiLogEntity;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "game_stage_id", nullable = false)
    private GameStageEntity gameStageEntity;

}