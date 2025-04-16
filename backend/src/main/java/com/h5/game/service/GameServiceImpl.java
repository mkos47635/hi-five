package com.h5.game.service;

import com.h5.asset.entity.GameStageEntity;
import com.h5.asset.repository.GameChapterRepository;
import com.h5.asset.repository.GameStageRepository;
import com.h5.child.entity.ChildUserEntity;
import com.h5.child.repository.ChildUserRepository;
import com.h5.emotion.entity.EmotionEntity;
import com.h5.emotion.repository.EmotionRepository;
import com.h5.game.dto.request.*;
import com.h5.game.dto.response.EndGameChapterResponseDto;
import com.h5.game.dto.response.SaveGameLogResponseDto;
import com.h5.game.dto.response.StartGameChapterResponseDto;
import com.h5.game.dto.response.StartGameStageResponseDto;
import com.h5.game.entity.AiLogEntity;
import com.h5.game.entity.ChildGameChapterEntity;
import com.h5.game.entity.ChildGameStageEntity;
import com.h5.game.entity.GameLogEntity;
import com.h5.game.repository.AiLogRepository;
import com.h5.game.repository.ChildGameChapterRepository;
import com.h5.game.repository.ChildGameStageRepository;
import com.h5.game.repository.GameLogRepository;
import com.h5.global.exception.GameNotFoundException;
import com.h5.global.exception.StatisticNotFoundException;
import com.h5.global.exception.UserNotFoundException;
import com.h5.statistic.entity.StatisticEntity;
import com.h5.statistic.repository.StatisticRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class GameServiceImpl implements GameService {

    private final AiLogRepository aiLogRepository;
    private final ChildGameChapterRepository childGameChapterRepository;
    private final ChildGameStageRepository childGameStageRepository;
    private final GameLogRepository gameLogRepository;
    private final ChildUserRepository childUserRepository;
    private final GameChapterRepository gameChapterRepository;
    private final GameStageRepository gameStageRepository;
    private final StatisticRepository statisticRepository;

    private final int BASIC_SCORE = 100;
    private final EmotionRepository emotionRepository;

    @Transactional
    @Override
    public StartGameChapterResponseDto startGameChapter(StartGameChapterRequsetDto startGameChapterRequsetDto) {
        return StartGameChapterResponseDto.builder()
                .childGameChapterId(childGameChapterRepository.save(ChildGameChapterEntity.builder()
                        .childUserEntity(childUserRepository.findById(startGameChapterRequsetDto.getChildUserId())
                                .orElseThrow(UserNotFoundException::new))
                        .gameChapterEntity(gameChapterRepository.findById(startGameChapterRequsetDto.getGameChapterId())
                                .orElseThrow(() -> new GameNotFoundException("Game chapter not found")))
                        .startDttm(LocalDateTime.now())
                        .build())
                        .getId())
                .build();
    }

    @Transactional
    @Override
    public StartGameStageResponseDto startGameStage(StartGameStageRequestDto startGameStageRequestDto) {
        return StartGameStageResponseDto.builder()
                .childGameStageId(childGameStageRepository.save(ChildGameStageEntity.builder()
                                .gameStageEntity(gameStageRepository.findById(startGameStageRequestDto.getGameStageId())
                                        .orElseThrow(() -> new GameNotFoundException("Game stage not found")))
                                .childGameChapterEntity(childGameChapterRepository.findById(startGameStageRequestDto.getChildGameChapterId())
                                        .orElseThrow(() -> new GameNotFoundException("Child game chapter not found")))
                        .build())
                        .getId())
                .build();
    }

    @Transactional
    @Override
    public EndGameChapterResponseDto endGameChapter(EndGameChapterRequestDto endGameChapterRequestDto) {
        ChildGameChapterEntity childGameChapterEntity = childGameChapterRepository.findById(endGameChapterRequestDto.getChildGameChapterId())
                .orElseThrow(() -> new GameNotFoundException("Entity not found"));
        childGameChapterEntity.setEndDttm(LocalDateTime.now());
        childGameChapterRepository.save(childGameChapterEntity);

        updateAnalytics(childGameChapterEntity);

        return EndGameChapterResponseDto.builder()
                .childGameChapterId(childGameChapterEntity.getId())
                .build();
    }

    @Transactional
    @Override
    public SaveGameLogResponseDto saveGameLog(SaveGameLogRequestDto saveGameLogRequestDto) {

        GameLogEntity gameLogEntity = gameLogRepository.save(GameLogEntity.builder()
                .selectedOpt(saveGameLogRequestDto.getSelectedOption())
                .corrected(saveGameLogRequestDto.isCorrected())
                .submitDttm(LocalDateTime.now())
                .consulted(saveGameLogRequestDto.isConsulted())
                .childGameStageEntity(childGameStageRepository.findById(saveGameLogRequestDto.getChildGameStageId())
                        .orElseThrow(() -> new GameNotFoundException("Child game stage not found")))
                .childUserEntity(childUserRepository.findById(saveGameLogRequestDto.getChildUserId())
                        .orElseThrow(UserNotFoundException::new))
                .gameStageEntity(gameStageRepository.findById(saveGameLogRequestDto.getGameStageId())
                        .orElseThrow(() -> new GameNotFoundException("Child game stage not found")))
                .build());

        AiLogEntity aiLogEntity = aiLogRepository.save(AiLogEntity.builder()
                .gameLogEntity(gameLogEntity)
                .fHappy(saveGameLogRequestDto.getFHappy())
                .fAnger(saveGameLogRequestDto.getFAnger())
                .fSad(saveGameLogRequestDto.getFSad())
                .fPanic(saveGameLogRequestDto.getFPanic())
                .fFear(saveGameLogRequestDto.getFFear())
                .tHappy(saveGameLogRequestDto.getTHappy())
                .tAnger(saveGameLogRequestDto.getTAnger())
                .tSad(saveGameLogRequestDto.getTSad())
                .tPanic(saveGameLogRequestDto.getTPanic())
                .tFear(saveGameLogRequestDto.getTFear())
                .stt(saveGameLogRequestDto.getStt())
                .aiAnalyze(saveGameLogRequestDto.getAiAnalysis())
                .build());

        return SaveGameLogResponseDto.builder()
                .gameLogId(gameLogEntity.getId())
                .aiLogId(aiLogEntity.getId())
                .build();
    }

    @Override
    public int updateChildClearedStage(UpdateChildClearedStageRequestDto updateChildClearedStageRequestDto) {
        int childId = updateChildClearedStageRequestDto.getChildId();
        int chapter = updateChildClearedStageRequestDto.getChapter();
        int stage = updateChildClearedStageRequestDto.getStage();

        ChildUserEntity childUserEntity = childUserRepository.findById(childId)
                .orElseThrow(UserNotFoundException::new);
        int nowCleared = childUserEntity.getClearChapter();

        int cleared = (chapter-1)*5 + stage;
        if(nowCleared >= cleared) {
            return 0;
        }
        childUserEntity.setClearChapter(cleared);
        childUserRepository.save(childUserEntity);

        return cleared;
    }

    private void updateAnalytics(ChildGameChapterEntity chapter) {
        List<ChildGameStageEntity> childStages = childGameStageRepository
                .findAllByChildGameChapterEntity_Id(chapter.getId())
                .orElseThrow(() -> new GameNotFoundException("Child game stage not found"));

        // 자식 스테이지들을 게임 스테이지 ID 기준으로 그룹화(같은 게임 스테이지에 대해 중복 업데이트 방지)
        Map<Integer, List<ChildGameStageEntity>> stagesGroupedByGameStageId = childStages.stream()
                .collect(Collectors.groupingBy(cs -> cs.getGameStageEntity().getId()));

        int childUserId = chapter.getChildUserEntity().getId();
        LocalDateTime startDttm = chapter.getStartDttm();
        LocalDateTime endDttm = chapter.getEndDttm();
        int gameChapterId = chapter.getGameChapterEntity().getId();

        // 각 게임 스테이지 그룹별로 통계 업데이트
        for (Map.Entry<Integer, List<ChildGameStageEntity>> entry : stagesGroupedByGameStageId.entrySet()) {
            int gameStageId = entry.getKey();
            updateStatisticForGameStage(childUserId, gameStageId, startDttm, endDttm, gameChapterId);
        }
    }

    private void updateStatisticForGameStage(int childUserId, int gameStageId, LocalDateTime startDttm,
                                             LocalDateTime endDttm, int gameChapterId) {

        GameStageEntity gameStage = gameStageRepository.findById(gameStageId)
                .orElseThrow(() -> new GameNotFoundException("Game stage not found"));
        int emotionId = gameStage.getEmotionEntity().getId();

        List<GameLogEntity> gameLogs = gameLogRepository
                .findAllByChildUserEntity_IdAndGameStageEntity_IdAndSubmitDttmBetween(
                        childUserId, gameStageId, startDttm, endDttm)
                .orElse(Collections.emptyList());
        gameLogs.sort(Comparator.comparing(GameLogEntity::getSubmitDttm));

        OptionalInt firstCorrectIndex = IntStream.range(0, gameLogs.size())
                .filter(i -> gameLogs.get(i).getCorrected())
                .findFirst();
        boolean isCorrect = firstCorrectIndex.isPresent();
        int whenCorrect = firstCorrectIndex.orElse(gameLogs.size()) + 1;

        StatisticEntity statisticEntity = statisticRepository
                .findByEmotionEntity_IdAndChildUserEntity_Id(emotionId, childUserId)
                .orElseGet(() -> {
                    EmotionEntity emotionEntity = emotionRepository.findById(emotionId)
                            .orElseThrow(() -> new RuntimeException("EmotionEntity not found"));
                    ChildUserEntity childUserEntity = childUserRepository.findById(childUserId)
                            .orElseThrow(() -> new RuntimeException("ChildUserEntity not found"));

                    StatisticEntity newEntity = StatisticEntity.builder()
                            .rating(0)
                            .trialCnt(0)
                            .crtCnt(0)
                            .stageCrtRate1(BigDecimal.ZERO)
                            .stageCrtRate2(BigDecimal.ZERO)
                            .stageCrtRate3(BigDecimal.ZERO)
                            .stageCrtRate4(BigDecimal.ZERO)
                            .stageCrtRate5(BigDecimal.ZERO)
                            .emotionEntity(emotionEntity)
                            .childUserEntity(childUserEntity)
                            .stageTryCnt1(0)
                            .stageTryCnt2(0)
                            .stageTryCnt3(0)
                            .stageTryCnt4(0)
                            .stageTryCnt5(0)
                            .stageCrtCnt1(0)
                            .stageCrtCnt2(0)
                            .stageCrtCnt3(0)
                            .stageCrtCnt4(0)
                            .stageCrtCnt5(0)
                            .build();
                    return statisticRepository.save(newEntity);
                });


        int logCount = gameLogs.size();
        statisticEntity.setTrialCnt(statisticEntity.getTrialCnt() + logCount);
        if (isCorrect) {
            statisticEntity.setCrtCnt(statisticEntity.getCrtCnt() + 1);
        }

        double scoreIncrement = (whenCorrect < 3 ? (1.0 / whenCorrect) * BASIC_SCORE : 0.0);
        statisticEntity.setRating((int) (statisticEntity.getRating() + scoreIncrement));

        switch (gameChapterId) {
            case 1:
                statisticEntity.setStageTryCnt1(statisticEntity.getStageTryCnt1() + logCount);
                statisticEntity.setStageCrtCnt1(statisticEntity.getStageCrtCnt1() + (isCorrect ? 1 : 0));
                statisticEntity.setStageCrtRate1(calculateRate(statisticEntity.getStageCrtCnt1(), statisticEntity.getStageTryCnt1()));
                break;
            case 2:
                statisticEntity.setStageTryCnt2(statisticEntity.getStageTryCnt2() + logCount);
                statisticEntity.setStageCrtCnt2(statisticEntity.getStageCrtCnt2() + (isCorrect ? 1 : 0));
                statisticEntity.setStageCrtRate2(calculateRate(statisticEntity.getStageCrtCnt2(), statisticEntity.getStageTryCnt2()));
                break;
            case 3:
                statisticEntity.setStageTryCnt3(statisticEntity.getStageTryCnt3() + logCount);
                statisticEntity.setStageCrtCnt3(statisticEntity.getStageCrtCnt3() + (isCorrect ? 1 : 0));
                statisticEntity.setStageCrtRate3(calculateRate(statisticEntity.getStageCrtCnt3(), statisticEntity.getStageTryCnt3()));
                break;
            case 4:
                statisticEntity.setStageTryCnt4(statisticEntity.getStageTryCnt4() + logCount);
                statisticEntity.setStageCrtCnt4(statisticEntity.getStageCrtCnt4() + (isCorrect ? 1 : 0));
                statisticEntity.setStageCrtRate4(calculateRate(statisticEntity.getStageCrtCnt4(), statisticEntity.getStageTryCnt4()));
                break;
            case 5:
                statisticEntity.setStageTryCnt5(statisticEntity.getStageTryCnt5() + logCount);
                statisticEntity.setStageCrtCnt5(statisticEntity.getStageCrtCnt5() + (isCorrect ? 1 : 0));
                statisticEntity.setStageCrtRate5(calculateRate(statisticEntity.getStageCrtCnt5(), statisticEntity.getStageTryCnt5()));
                break;
            default:
                break;
        }

        statisticRepository.save(statisticEntity);
    }

    private BigDecimal calculateRate(int correctCount, int tryCount) {
        if (tryCount == 0) {
            return BigDecimal.ZERO;
        }
        double rate = ((double) correctCount / tryCount) * 100;
        return BigDecimal.valueOf(rate);
    }

}
