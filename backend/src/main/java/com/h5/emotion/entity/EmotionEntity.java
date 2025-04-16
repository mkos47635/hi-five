package com.h5.emotion.entity;

import com.h5.asset.entity.GameStageEntity;
import com.h5.statistic.entity.StatisticEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor
@Table(name = "emotion")
public class EmotionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "emotion_id", nullable = false)
    private Integer id;

    @Size(max = 20)
    @NotNull
    @Column(name = "emo", nullable = false, length = 20)
    private String emo;

    @OneToMany(mappedBy = "emotionEntity")
    private Set<GameStageEntity> gameStageEntities = new LinkedHashSet<>();

    @OneToMany(mappedBy = "emotionEntity")
    private Set<StatisticEntity> statisticEntities = new LinkedHashSet<>();

}