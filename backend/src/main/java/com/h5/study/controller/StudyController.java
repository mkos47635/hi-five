package com.h5.study.controller;

import com.h5.study.dto.request.EndStudyChapterRequestDto;
import com.h5.study.dto.request.SaveStudyLogRequestDto;
import com.h5.study.dto.request.StartStudyChapterRequsetDto;
import com.h5.study.dto.request.StartStudyStageRequestDto;
import com.h5.study.service.StudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/study")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class StudyController {

    private final StudyService studyService;

    @PostMapping("/start-study-chapter")
    public ResponseEntity<?> startGameChapter(@RequestBody StartStudyChapterRequsetDto startStudyChapterRequsetDto) {
        return ResponseEntity.ok(studyService.startStudyChapter(startStudyChapterRequsetDto));
    }

    @PostMapping("/end-study-chapter")
    public ResponseEntity<?> endGameChapter(@RequestBody EndStudyChapterRequestDto endStudyChapterRequestDto) {
        return ResponseEntity.ok(studyService.endStudyChapter(endStudyChapterRequestDto));
    }

    @PostMapping("/start-study-stage")
    public ResponseEntity<?> startGameStage(@RequestBody StartStudyStageRequestDto startStudyStageRequestDto) {
        return ResponseEntity.ok(studyService.startStudyStage(startStudyStageRequestDto));
    }

    @PostMapping("/save-log")
    public ResponseEntity<?> saveGameLog(SaveStudyLogRequestDto saveStudyLogRequestDto) {
        return ResponseEntity.ok(studyService.saveStudyLog(saveStudyLogRequestDto));
    }

}
