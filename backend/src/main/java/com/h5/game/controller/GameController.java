package com.h5.game.controller;

import com.h5.game.dto.request.*;
import com.h5.game.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/game")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @PostMapping("/start-game-chapter")
    public ResponseEntity<?> startGameChapter(@RequestBody StartGameChapterRequsetDto startGameChapterRequsetDto) {
        return ResponseEntity.ok(gameService.startGameChapter(startGameChapterRequsetDto));
    }

    @PostMapping("/end-game-chapter")
    public ResponseEntity<?> endGameChapter(@RequestBody EndGameChapterRequestDto endGameChapterRequestDto) {
        return ResponseEntity.ok(gameService.endGameChapter(endGameChapterRequestDto));
    }

    @PostMapping("/start-game-stage")
    public ResponseEntity<?> startGameStage(@RequestBody StartGameStageRequestDto startGameStageRequestDto) {
        return ResponseEntity.ok(gameService.startGameStage(startGameStageRequestDto));
    }

    @PostMapping("/save-log")
    public ResponseEntity<?> saveGameLog(@RequestBody SaveGameLogRequestDto saveGameLogRequestDto) {
        return ResponseEntity.ok(gameService.saveGameLog(saveGameLogRequestDto));
    }

    @PostMapping("/update-child-stage")
    public ResponseEntity<?> updateChildClearedStage(@RequestBody UpdateChildClearedStageRequestDto updateChildClearedStageRequestDto){
        return ResponseEntity.ok(gameService.updateChildClearedStage(updateChildClearedStageRequestDto));
    }
}
