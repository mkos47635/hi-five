package com.h5.study.service;

import com.h5.asset.repository.GameChapterRepository;
import com.h5.asset.repository.GameStageRepository;
import com.h5.child.repository.ChildUserRepository;
import com.h5.global.exception.GameNotFoundException;
import com.h5.global.exception.UserNotFoundException;
import com.h5.study.dto.request.EndStudyChapterRequestDto;
import com.h5.study.dto.request.SaveStudyLogRequestDto;
import com.h5.study.dto.request.StartStudyChapterRequsetDto;
import com.h5.study.dto.request.StartStudyStageRequestDto;
import com.h5.study.dto.response.EndStudyChapterResponseDto;
import com.h5.study.dto.response.SaveStudyLogResponseDto;
import com.h5.study.dto.response.StartStudyChapterResponseDto;
import com.h5.study.dto.response.StartStudyStageResponseDto;
import com.h5.study.entity.ChildStudyChapterEntity;
import com.h5.study.entity.ChildStudyStageEntity;
import com.h5.study.entity.StudyTextLogEntity;
import com.h5.study.entity.StudyVideoLogEntity;
import com.h5.study.repository.ChildStudyChapterRepository;
import com.h5.study.repository.ChildStudyStageRepository;
import com.h5.study.repository.StudyTextLogRepository;
import com.h5.study.repository.StudyVideoLogRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class StudyServiceImpl implements StudyService {

    private final ChildStudyChapterRepository childStudyChapterRepository;
    private final ChildStudyStageRepository childStudyStageRepository;
    private final ChildUserRepository childUserRepository;
    private final GameChapterRepository gameChapterRepository;
    private final GameStageRepository gameStageRepository;
    private final StudyVideoLogRepository studyVideoLogRepository;
    private final StudyTextLogRepository studyTextLogRepository;

    @Transactional
    @Override
    public StartStudyChapterResponseDto startStudyChapter(StartStudyChapterRequsetDto startStudyChapterRequsetDto) {
        return StartStudyChapterResponseDto.builder()
                .childStudyChapterId(childStudyChapterRepository.save(ChildStudyChapterEntity.builder()
                        .childUserEntity(childUserRepository.findById(startStudyChapterRequsetDto.getChildUserId())
                                .orElseThrow(UserNotFoundException::new))
                        .gameChapterEntity(gameChapterRepository.findById(startStudyChapterRequsetDto.getStudyChapterId())
                                .orElseThrow(() -> new GameNotFoundException("Chapter not found")))
                        .startDttm(LocalDateTime.now())
                        .build())
                        .getId())
                .build();
    }

    @Override
    public StartStudyStageResponseDto startStudyStage(StartStudyStageRequestDto startStudyStageRequestDto) {
        return StartStudyStageResponseDto.builder()
                .childStudyStageId(childStudyStageRepository.save(ChildStudyStageEntity.builder()
                        .gameStageEntity(gameStageRepository.findById(startStudyStageRequestDto.getGameStageId())
                                .orElseThrow(() -> new GameNotFoundException("Game stage not found")))
                        .childStudyChapterEntity(childStudyChapterRepository.findById(startStudyStageRequestDto.getChildStudyChapterId())
                                .orElseThrow(() -> new GameNotFoundException("Child game chapter not found")))
                        .build())
                        .getId())
                .build();
    }

    @Override
    public EndStudyChapterResponseDto endStudyChapter(EndStudyChapterRequestDto endStudyChapterRequestDto) {
        ChildStudyChapterEntity childStudyChapterEntity = childStudyChapterRepository.findById(endStudyChapterRequestDto.getChildStudyChapterId())
                .orElseThrow(() -> new GameNotFoundException("Child study chapter not found"));
        childStudyChapterEntity.setEndDttm(LocalDateTime.now());
        childStudyChapterRepository.save(childStudyChapterEntity);
        return EndStudyChapterResponseDto.builder()
                .childStudyChapterId(childStudyChapterEntity.getId())
                .build();
    }

    @Override
    public SaveStudyLogResponseDto saveStudyLog(SaveStudyLogRequestDto saveStudyLogRequestDto) {

        StudyVideoLogEntity studyVideoLogEntity = studyVideoLogRepository.save(StudyVideoLogEntity.builder()
                        .childStudyStageEntity(childStudyStageRepository.findById(saveStudyLogRequestDto.getChildGameStageId())
                                .orElseThrow(() -> new GameNotFoundException("Child study stage not found")))
                        .fHappy(saveStudyLogRequestDto.getFHappy())
                        .fAnger(saveStudyLogRequestDto.getFAnger())
                        .fSad(saveStudyLogRequestDto.getFSad())
                        .fPanic(saveStudyLogRequestDto.getFPanic())
                        .fFear(saveStudyLogRequestDto.getFFear())
                        .startDttm(LocalDateTime.now())
                        .endDttm(LocalDateTime.now())
                .build());

        StudyTextLogEntity studyTextLogEntity = studyTextLogRepository.save(StudyTextLogEntity.builder()
                        .childStudyStageEntity(childStudyStageRepository.findById(saveStudyLogRequestDto.getChildGameStageId())
                                .orElseThrow(() -> new GameNotFoundException("Child study stage not found")))
                        .tHappy(saveStudyLogRequestDto.getTHappy())
                        .tAnger(saveStudyLogRequestDto.getTAnger())
                        .tSad(saveStudyLogRequestDto.getTSad())
                        .tPanic(saveStudyLogRequestDto.getTPanic())
                        .tFear(saveStudyLogRequestDto.getTFear())
                        .stt(saveStudyLogRequestDto.getStt())
                        .startDttm(LocalDateTime.now())
                        .endDttm(LocalDateTime.now())
                        .textSimilarity(saveStudyLogRequestDto.getTextSimilarity())
                .build());

        return SaveStudyLogResponseDto.builder()
                .studyVideoLogId(studyVideoLogEntity.getId())
                .studyTextLogId(studyTextLogEntity.getId())
                .build();
    }
}
