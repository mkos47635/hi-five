package com.h5.statistic.service;

import com.h5.child.repository.ChildUserRepository;
import com.h5.emotion.entity.EmotionEntity;
import com.h5.emotion.repository.EmotionRepository;
import com.h5.game.entity.ChildGameChapterEntity;
import com.h5.game.entity.GameLogEntity;
import com.h5.game.repository.ChildGameChapterRepository;
import com.h5.game.repository.GameLogRepository;
import com.h5.global.exception.StatisticNotFoundException;
import com.h5.global.exception.UserNotFoundException;
import com.h5.statistic.dto.response.DataAnalysisResponseDto;
import com.h5.statistic.dto.response.GetGameVideoDatesResponseDto;
import com.h5.statistic.dto.response.GetGameVideoLengthResponseDto;
import com.h5.statistic.entity.StatisticEntity;
import com.h5.statistic.repository.StatisticRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class StatisticServiceImpl implements StatisticService {

    private final StatisticRepository statisticRepository;
    private final EmotionRepository emotionRepository;
    private final ChildUserRepository childUserRepository;
    private final ChildGameChapterRepository childGameChapterRepository;
    private final GameLogRepository gameLogRepository;

    @Autowired
    public StatisticServiceImpl(StatisticRepository statisticRepository,
                                EmotionRepository emotionRepository,
                                ChildUserRepository childUserRepository,
                                ChildGameChapterRepository childGameChapterRepository,
                                GameLogRepository gameLogRepository) {
        this.statisticRepository = statisticRepository;
        this.emotionRepository = emotionRepository;
        this.childUserRepository = childUserRepository;
        this.childGameChapterRepository = childGameChapterRepository;
        this.gameLogRepository = gameLogRepository;
    }

    @Override
    public Map<Integer, DataAnalysisResponseDto> dataAnalysis(int childUserId) {
        List<EmotionEntity> emotionEntityList = emotionRepository.findAll();

        Map<Integer, DataAnalysisResponseDto> PentagonAndStickDataDtoMap = new HashMap<>();
        for (EmotionEntity emotionEntity : emotionEntityList) {
            int emotionEntityId = emotionEntity.getId();

            StatisticEntity statisticEntity = statisticRepository.findByEmotionEntity_IdAndChildUserEntity_Id(emotionEntityId, childUserId)
                    .orElseThrow(() -> new StatisticNotFoundException("Statistic not found"));

            DataAnalysisResponseDto dataAnalysisRequestDto = DataAnalysisResponseDto.builder()
                    .childUserId(childUserId)
                    .childName(childUserRepository.findNameByIdAndDeleteDttmIsNull(childUserId)
                            .orElseThrow(UserNotFoundException::new)
                            .getName())
                    .emotionId(emotionEntityId)
                    .rating(statisticEntity.getRating())
                    .totalTryCnt(statisticEntity.getTrialCnt())
                    .totalCrtCnt(statisticEntity.getCrtCnt())
                    .stageCrtRate1(statisticEntity.getStageCrtRate1())
                    .stageCrtRate2(statisticEntity.getStageCrtRate2())
                    .stageCrtRate3(statisticEntity.getStageCrtRate3())
                    .stageCrtRate4(statisticEntity.getStageCrtRate4())
                    .stageCrtRate5(statisticEntity.getStageCrtRate5())
                    .stageCrtCnt1(statisticEntity.getStageCrtCnt1())
                    .stageCrtCnt2(statisticEntity.getStageCrtCnt2())
                    .stageCrtCnt3(statisticEntity.getStageCrtCnt3())
                    .stageCrtCnt4(statisticEntity.getStageCrtCnt4())
                    .stageCrtCnt5(statisticEntity.getStageCrtCnt5())
                    .stageTryCnt1(statisticEntity.getStageTryCnt1())
                    .stageTryCnt2(statisticEntity.getStageTryCnt2())
                    .stageTryCnt3(statisticEntity.getStageTryCnt3())
                    .stageTryCnt4(statisticEntity.getStageTryCnt4())
                    .stageTryCnt5(statisticEntity.getStageTryCnt5())
                    .build();

            PentagonAndStickDataDtoMap.put(emotionEntityId, dataAnalysisRequestDto);
        }

        return PentagonAndStickDataDtoMap;
    }

    @Override
    public GetGameVideoDatesResponseDto getGameVideoDates(int childUserId, int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59);

        List<ChildGameChapterEntity> childGameChapterEntityList = childGameChapterRepository.findByChildUserEntity_IdAndStartDttmBetween(childUserId,startDate,endDate)
                .orElseThrow(NoSuchElementException::new);

        return GetGameVideoDatesResponseDto.builder()
                .dateList(childGameChapterEntityList.stream()
                        .map(video -> video.getStartDttm().toLocalDate())
                        .distinct()
                        .sorted()
                        .collect(Collectors.toList()))
                .build();
    }

    @Override
    public List<GetGameVideoLengthResponseDto> getGameVideoLength(int childUserId, LocalDate date, int stageId) {
        LocalDateTime startDate = date.atStartOfDay();
        LocalDateTime endDate = date.atTime(23, 59, 59);

        List<GameLogEntity> gameLogEntityList = gameLogRepository
                .findAllByChildUserEntity_IdAndGameStageEntity_IdAndSubmitDttmBetween(childUserId, stageId, startDate, endDate)
                .orElseThrow(() -> new NoSuchElementException("No game logs found for given criteria"));

        AtomicInteger index = new AtomicInteger(0);
        return gameLogEntityList.stream()
                .map(gameLog -> GetGameVideoLengthResponseDto.builder()
                        .tryIndex(index.getAndIncrement()) // 인덱스 증가
                        .gameLogId(gameLog.getId())
                        .build())
                .collect(Collectors.toList());
    }

}
