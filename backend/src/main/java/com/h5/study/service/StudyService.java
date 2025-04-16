package com.h5.study.service;

import com.h5.study.dto.request.EndStudyChapterRequestDto;
import com.h5.study.dto.request.SaveStudyLogRequestDto;
import com.h5.study.dto.request.StartStudyChapterRequsetDto;
import com.h5.study.dto.request.StartStudyStageRequestDto;
import com.h5.study.dto.response.EndStudyChapterResponseDto;
import com.h5.study.dto.response.SaveStudyLogResponseDto;
import com.h5.study.dto.response.StartStudyChapterResponseDto;
import com.h5.study.dto.response.StartStudyStageResponseDto;

public interface StudyService {

    StartStudyChapterResponseDto startStudyChapter(StartStudyChapterRequsetDto startStudyChapterRequsetDto);

    StartStudyStageResponseDto startStudyStage(StartStudyStageRequestDto startStudyStageRequestDto);

    EndStudyChapterResponseDto endStudyChapter(EndStudyChapterRequestDto endStudyChapterRequestDto);

    SaveStudyLogResponseDto saveStudyLog(SaveStudyLogRequestDto saveStudyLogRequestDto);

}
