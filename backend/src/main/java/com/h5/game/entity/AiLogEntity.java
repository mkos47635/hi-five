package com.h5.game.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "ai_log")
public class AiLogEntity {

    @Id
    @Column(name = "game_log_id", nullable = false)
    private Integer id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "game_log_id", nullable = false)
    private GameLogEntity gameLogEntity;

    @NotNull
    @Column(name = "f_happy", nullable = false)
    private Integer fHappy;

    @NotNull
    @Column(name = "f_anger", nullable = false)
    private Integer fAnger;

    @NotNull
    @Column(name = "f_sad", nullable = false)
    private Integer fSad;

    @NotNull
    @Column(name = "f_panic", nullable = false)
    private Integer fPanic;

    @NotNull
    @Column(name = "f_fear", nullable = false)
    private Integer fFear;

    @NotNull
    @Column(name = "t_happy", nullable = false)
    private Integer tHappy;

    @NotNull
    @Column(name = "t_anger", nullable = false)
    private Integer tAnger;

    @NotNull
    @Column(name = "t_sad", nullable = false)
    private Integer tSad;

    @NotNull
    @Column(name = "t_panic", nullable = false)
    private Integer tPanic;

    @NotNull
    @Column(name = "t_fear", nullable = false)
    private Integer tFear;

    @NotNull
    @Lob
    @Column(name = "stt", nullable = false)
    private String stt;

    @NotNull
    @Lob
    @Column(name = "ai_analyze")
    private String aiAnalyze;

}