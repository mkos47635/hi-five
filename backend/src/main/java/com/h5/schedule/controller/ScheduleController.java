package com.h5.schedule.controller;

import com.h5.schedule.dto.request.*;
import com.h5.schedule.dto.response.ScheduleResponseDto;
import com.h5.schedule.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/schedule")
@RequiredArgsConstructor
@Tag(name = "스케줄 API", description = "상담 및 게임 스케줄 관련 API")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @GetMapping("/list-by-date")
    @Operation(summary = "날짜 별 상담 일정 조회", description = "상담사가 특정 날짜의 상담 일정을 조회합니다.")
    public ResponseEntity<List<ScheduleResponseDto>> getSchedulesByDate(
            @ModelAttribute ScheduleSearchByDateRequestDto scheduleSearchByDateRequestDto) {
        List<ScheduleResponseDto> schedules = scheduleService.getSchedulesByDate(scheduleSearchByDateRequestDto);
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/dates-by-child")
    @Operation(summary = "아동 상담 날짜 조회", description = "특정 아동의 상담이 있는 날짜를 조회합니다.")
    public ResponseEntity<List<String>> getScheduleDatesByChildId(
            @ModelAttribute ScheduleSearchByChildRequestDto scheduleSearchByChildRequestDto) {
        List<String> dates = scheduleService.getScheduleDatesByChildUserId(scheduleSearchByChildRequestDto);
        return ResponseEntity.ok(dates);
    }

    @GetMapping("/list-by-child")
    @Operation(summary = "아동 상담 스케줄 조회", description = "특정 아동의 상담 및 게임 일정을 조회합니다.")
    public ResponseEntity<List<ScheduleResponseDto>> getSchedulesByChildId(
            @ModelAttribute ScheduleSearchByChildRequestDto scheduleSearchByChildRequestDto) {
        List<ScheduleResponseDto> schedules = scheduleService.getSchedulesByChildUserId(scheduleSearchByChildRequestDto);
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/available-times")
    @Operation(summary = "비어있는 시간대 조회", description = "상담사가 특정 날짜의 비어있는 시간대를 조회합니다.")
    public ResponseEntity<List<String>> getAvailableTimes(
            @ModelAttribute ScheduleAvailableTimeRequestDto scheduleAvailableTimeRequestDto) {
        List<String> availableTimes = scheduleService.getAvailableTimes(scheduleAvailableTimeRequestDto);
        return ResponseEntity.ok(availableTimes);
    }

    @PostMapping("/create")
    @Operation(summary = "새 상담/게임 스케줄 등록", description = "상담사가 새로운 상담/게임 스케줄을 등록합니다.")
    public ResponseEntity<String> createSchedule(@RequestBody ScheduleCreateRequestDto scheduleCreateRequestDto) {
        scheduleService.createSchedule(scheduleCreateRequestDto);
        return ResponseEntity.ok("Schedule created successfully.");
    }

    @PutMapping("/update")
    @Operation(summary = "스케줄 수정", description = "상담사가 기존 스케줄을 수정합니다.")
    public ResponseEntity<String> updateSchedule(
            @RequestBody ScheduleUpdateRequestDto scheduleUpdateRequestDto) {
        scheduleService.updateSchedule(scheduleUpdateRequestDto);
        return ResponseEntity.ok("Schedule updated successfully.");
    }

    @PutMapping("/delete/{scheduleId}")
    @Operation(summary = "스케줄 삭제", description = "상담사가 기존 스케줄을 삭제합니다.")
    public ResponseEntity<String> deleteSchedule(@RequestBody ScheduleDeleteRequestDto scheduleDeleteRequestDto) {
        scheduleService.deleteSchedule(scheduleDeleteRequestDto);
        return ResponseEntity.ok("Schedule deleted successfully.");
    }

    @GetMapping("/list-by-parent")
    @Operation(summary = "내 아동 스케줄 조회", description = "학부모가 자신의 아동의 상담 일정을 조회합니다.")
    public ResponseEntity<List<ScheduleResponseDto>> getSchedulesByParentId(
            @ModelAttribute ScheduleSearchByParentRequestDto scheduleSearchByParentRequestDto) {
        List<ScheduleResponseDto> schedules = scheduleService.getSchedulesByParentUserId(scheduleSearchByParentRequestDto);
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/dates-by-parent")
    @Operation(summary = "내 아동 일정이 있는 날짜 조회", description = "학부모가 자신의 아동 일정이 있는 날짜 목록을 조회합니다.")
    public ResponseEntity<List<String>> getScheduleDatesByParentId(ScheduleSearchByParentRequestDto scheduleSearchByParentRequestDto) {
        List<String> dates = scheduleService.getScheduleDatesByParentUserId(scheduleSearchByParentRequestDto);
        return ResponseEntity.ok(dates);
    }

}
