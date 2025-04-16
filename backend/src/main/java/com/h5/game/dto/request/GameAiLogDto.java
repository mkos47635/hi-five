package com.h5.game.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
public class GameAiLogDto {
    private int childId;
    private String timeStamp;
    private List<Map<String, Double>> emotions;
    private String firstEmotion;
    private String secondEmotion;

    private static int convertEmotionToEmotionId(String emotion) {
        return switch (emotion.toLowerCase()){
            case "neutral" -> 1;
            case "happy" -> 2;
            case "sad" -> 3;
            case "angry" -> 4;
            case "fearful" -> 5;
            case "disgusted" -> 6;
            case "surprised" -> 7;
            default -> 0;
        };
    }

}
