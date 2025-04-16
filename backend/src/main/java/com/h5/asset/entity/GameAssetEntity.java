package com.h5.asset.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "game_asset")
public class GameAssetEntity {

    @Id
    @Column(name = "game_stage_id", nullable = false)
    private Integer id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "game_stage_id", nullable = false)
    private GameStageEntity gameStageEntity;

    @Size(max = 255)
    @NotNull
    @Column(name = "game_scene_video", nullable = false)
    private String gameSceneVideo;

    @Size(max = 200)
    @NotNull
    @Column(name = "opt_1", nullable = false, length = 200)
    private String opt1;

    @Size(max = 200)
    @NotNull
    @Column(name = "opt_2", nullable = false, length = 200)
    private String opt2;

    @Size(max = 200)
    @NotNull
    @Column(name = "opt_3", nullable = false, length = 200)
    private String opt3;

    @Size(max = 255)
    @NotNull
    @Column(name = "opt_pic_1", nullable = false)
    private String optPic1;

    @Size(max = 255)
    @NotNull
    @Column(name = "opt_pic_2", nullable = false)
    private String optPic2;

    @Size(max = 255)
    @NotNull
    @Column(name = "opt_pic_3", nullable = false)
    private String optPic3;

    @Size(max = 255)
    @NotNull
    @Column(name = "situation", nullable = false)
    private String situation;

}