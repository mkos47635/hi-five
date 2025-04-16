package com.h5.asset.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "card_asset")
public class CardAssetEntity {

    @Id
    @Column(name = "game_stage_id", nullable = false)
    private Integer id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "game_stage_id", nullable = false)
    private GameStageEntity gameStageEntity;

    @Size(max = 255)
    @NotNull
    @Column(name = "card_front", nullable = false)
    private String cardFront;

    @Size(max = 255)
    @NotNull
    @Column(name = "card_back", nullable = false)
    private String cardBack;

}