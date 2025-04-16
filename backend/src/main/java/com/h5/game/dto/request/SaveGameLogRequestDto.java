package com.h5.game.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Builder
public class SaveGameLogRequestDto {
    private int selectedOption;
    private boolean corrected;
    private boolean consulted;

    private int childGameStageId;
    private int childUserId;
    private int gameStageId;

    private int fHappy;
    private int fAnger;
    private int fSad;
    private int fPanic;
    private int fFear;
    private int tHappy;
    private int tAnger;
    private int tSad;
    private int tPanic;
    private int tFear;
    private String stt;
    private String aiAnalysis;

}