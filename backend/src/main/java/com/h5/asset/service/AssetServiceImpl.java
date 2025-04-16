package com.h5.asset.service;

import com.h5.asset.dto.request.LoadAssetByStageDto;
import com.h5.asset.dto.request.LoadAssetRequestDto;
import com.h5.asset.dto.request.LoadCardRequestDto;
import com.h5.asset.dto.request.LoadStudyAssetRequestDto;
import com.h5.asset.dto.response.*;
import com.h5.asset.entity.CardAssetEntity;
import com.h5.asset.entity.GameAssetEntity;
import com.h5.asset.entity.GameStageEntity;
import com.h5.asset.repository.CardAssetRepository;
import com.h5.asset.repository.GameAssetRepository;
import com.h5.asset.repository.GameChapterRepository;
import com.h5.asset.repository.GameStageRepository;
import com.h5.child.entity.ChildUserEntity;
import com.h5.child.repository.ChildUserRepository;
import com.h5.global.exception.UserNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetServiceImpl implements AssetService {
    private final ChildUserRepository childUserRepository;
    private final GameAssetRepository gameAssetRepository;
    private final CardAssetRepository cardAssetRepository;
    private final GameChapterRepository gameChapterRepository;
    private final GameStageRepository gameStageRepository;

    @Override
    @Transactional
    public LoadAssetResponseDto loadAsset(LoadAssetRequestDto loadAssetRequestDto) {
        ChildUserEntity childUserEntity = childUserRepository.findById(loadAssetRequestDto.getChildUserId())
                .orElseThrow(UserNotFoundException::new);
        int cleared = childUserEntity.getClearChapter();
        int chapter = ((cleared - 1) / 5) + 1;
        int stage = ((cleared - 1) % 5) + 1;
        int gameStageId = (chapter - 1) * 5 + stage;

        int stageAnswer = gameStageRepository.findById(gameStageId)
                .map(GameStageEntity::getCrtAns)
                .orElseThrow(() -> new RuntimeException("can not find gameStageId=" + gameStageId));

        GameAssetEntity gameAssetEntity = gameAssetRepository.findGameAssetByChapterAndStage(chapter, stage)
                .orElseThrow(RuntimeException::new);

        return LoadAssetResponseDto.builder()
                .gameStageId(stage)
                .chapterId(gameAssetEntity.getGameStageEntity().getGameChapterEntity().getId())
                .gameVideo(gameAssetEntity.getGameSceneVideo())
                .options(new String[]{gameAssetEntity.getOpt1(), gameAssetEntity.getOpt2(), gameAssetEntity.getOpt3()})
                .optionImages(new String[]{gameAssetEntity.getOptPic1(), gameAssetEntity.getOptPic2(), gameAssetEntity.getOptPic3()})
                .situation(gameAssetEntity.getSituation())
                .answer(stageAnswer)
                .build();
    }

    @Transactional
    @Override
    public LoadAssetResponseDto loadAssetByStage(LoadAssetByStageDto loadAssetByStageDto) {
        int chapter = loadAssetByStageDto.getChapter();
        int stage = loadAssetByStageDto.getStage();
        int gameStageId = (chapter - 1) * 5 + stage;
        int stageAnswer = gameStageRepository.findById(gameStageId)
                .map(GameStageEntity::getCrtAns)
                .orElseThrow(() -> new RuntimeException("can not find answer : gameStageId=" + gameStageId));


        GameAssetEntity gameAssetEntity = gameAssetRepository.findById(gameStageId)
                .orElseThrow(RuntimeException::new);

        CardAssetEntity cardAssetEntity = cardAssetRepository.findByGameStageEntity_Id(gameStageId)
                .orElseThrow(RuntimeException::new);

        return LoadAssetResponseDto.builder()
                .gameStageId(stage)
                .chapterId(gameAssetEntity.getGameStageEntity().getGameChapterEntity().getId())
                .gameVideo(gameAssetEntity.getGameSceneVideo())
                .options(new String[]{gameAssetEntity.getOpt1(), gameAssetEntity.getOpt2(), gameAssetEntity.getOpt3()})
                .optionImages(new String[]{gameAssetEntity.getOptPic1(), gameAssetEntity.getOptPic2(), gameAssetEntity.getOptPic3()})
                .situation(gameAssetEntity.getSituation())
                .answer(stageAnswer)
                .cardFront(cardAssetEntity.getCardFront())
                .cardBack(cardAssetEntity.getCardBack())
                .build();
    }

    @Transactional
    @Override
    public LoadCardResponseDto loadCards(LoadCardRequestDto loadCardRequestDto) {
        ChildUserEntity childUserEntity = childUserRepository.findById(loadCardRequestDto.getChildUserId())
                .orElseThrow(UserNotFoundException::new);
        int cleared = childUserEntity.getClearChapter();

        List<CardAssetEntity> cardAssetEntities = cardAssetRepository.findByGameStageEntity_IdLessThanEqual(cleared);

        List<CardAssetResponseDto> cardAssetList = cardAssetEntities.stream()
                .map(cardAssetEntity -> new CardAssetResponseDto(
                        cardAssetEntity.getGameStageEntity().getId(),
                        cardAssetEntity.getCardFront(),
                        cardAssetEntity.getCardBack()
                ))
                .toList();
        return LoadCardResponseDto.builder().cardAssetList(cardAssetList).build();
    }

    @Override
    @Transactional
    public LoadChapterAssetResponseDto loadChapterAsset(LoadAssetRequestDto loadAssetRequestDto) {
        int childId = loadAssetRequestDto.getChildUserId();
        int limit = childUserRepository.findById(childId).orElseThrow(UserNotFoundException::new).getClearChapter() / 5 + 1;

        List<ChapterAssetResponseDto> chapterAssetResponseDtoList = gameChapterRepository.findAll().stream()
                .map(gameChapter -> ChapterAssetResponseDto.builder()
                        .gameChapterId(gameChapter.getId())
                        .title(gameChapter.getTitle())
                        .chapterPic(gameChapter.getChapterPic())
                        .build())
                .toList();

        return LoadChapterAssetResponseDto.builder()
                .chapterAssetDtoList(chapterAssetResponseDtoList)
                .limit(limit)
                .build();
    }

    @Override
    @Transactional
    public List<LoadAssetResponseDto> loadStudyAsset(LoadStudyAssetRequestDto loadStudyAssetRequestDto) {
        int chapter = loadStudyAssetRequestDto.getChapter();
        int first = (chapter - 1) * 5 + 1;
        int last = first + 4;

        List<GameAssetEntity> gameAssetEntities = gameAssetRepository.findByIdBetween(first, last);

        return gameAssetEntities.stream()
                .map(this::convertToDto)
                .toList();
    }

    @Override
    public GetStageResponseDto getStage(int childId) {
        ChildUserEntity childUserEntity = childUserRepository.findById(childId).orElseThrow(UserNotFoundException::new);
        int gameStage = childUserEntity.getClearChapter();

        return GetStageResponseDto.builder()
                .chapter(gameStage/5 + 1)
                .stage(gameStage%5)
                .build();
    }

    private LoadAssetResponseDto convertToDto(GameAssetEntity entity) {
        int gameStageId = entity.getId();
        int stageAnswer = gameStageRepository.findById(gameStageId)
                .map(GameStageEntity::getCrtAns)
                .orElseThrow(() -> new RuntimeException("정답을 찾을 수 없습니다: gameStageId=" + gameStageId));
        int chapter = entity.getGameStageEntity().getGameChapterEntity().getId();
        int stage = entity.getGameStageEntity().getId() - (chapter - 1) * 5;

        return LoadAssetResponseDto.builder()
                .gameStageId(stage)
                .chapterId(chapter)
                .gameVideo(entity.getGameSceneVideo())
                .options(new String[]{entity.getOpt1(), entity.getOpt2(), entity.getOpt3()})
                .optionImages(new String[]{entity.getOptPic1(), entity.getOptPic2(), entity.getOptPic3()})
                .situation(entity.getSituation())
                .answer(stageAnswer)
                .build();
    }


}
