package com.h5.schedule.service;

import com.h5.child.entity.ChildUserEntity;
import com.h5.child.repository.ChildUserRepository;
import com.h5.consultant.entity.ConsultantUserEntity;
import com.h5.consultant.repository.ConsultantUserRepository;
import com.h5.global.exception.*;
import com.h5.parent.entity.ParentUserEntity;
import com.h5.parent.repository.ParentUserRepository;
import com.h5.schedule.dto.request.*;
import com.h5.schedule.dto.response.ScheduleResponseDto;
import com.h5.schedule.entity.ConsultMeetingScheduleEntity;
import com.h5.schedule.entity.GameMeetingScheduleEntity;
import com.h5.schedule.repository.ConsultMeetingScheduleRepository;
import com.h5.schedule.repository.GameMeetingScheduleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Transactional
@RequiredArgsConstructor
public class ScheduleServiceImpl implements ScheduleService {
    private final ConsultMeetingScheduleRepository consultMeetingScheduleRepository;
    private final GameMeetingScheduleRepository gameMeetingScheduleRepository;
    private final ConsultantUserRepository consultantUserRepository;
    private final ParentUserRepository parentUserRepository;
    private final ChildUserRepository childUserRepository;


    @Override
    public List<ScheduleResponseDto> getSchedulesByDate(ScheduleSearchByDateRequestDto scheduleSearchByDateRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String ConsultantEmail = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);

        if (!"ROLE_CONSULTANT".equals(role)) {
            throw new UserAccessDeniedException();
        }

        int consultantUserId = consultantUserRepository.findByEmail(ConsultantEmail)
                .orElseThrow(UserNotFoundException::new)
                .getId();

        LocalDate date = scheduleSearchByDateRequestDto.getDate();

        List<ConsultMeetingScheduleEntity> consultMeetings = consultMeetingScheduleRepository
                .findByHostIdAndSchdlDttm(consultantUserId, date);

        List<GameMeetingScheduleEntity> gameMeetings = gameMeetingScheduleRepository
                .findByHostIdAndSchdlDttm(consultantUserId, date);

        List<ScheduleResponseDto> schedules = new ArrayList<>();

        consultMeetings.forEach(consult -> schedules.add(
                ScheduleResponseDto.builder()
                        .scheduleId(consult.getId())
                        .schdlDttm(consult.getSchdlDttm())
                        .type("consult")
                        .childUserId(consult.getChildUserEntity().getId())
                        .consultantName(consult.getHost().getName())
                        .childName(consult.getChildUserEntity().getName())
                        .parentName(consult.getParentUserEntity().getName())
                        .parentEmail(consult.getParentUserEntity().getEmail())
                        .status(consult.getStatus())
                        .build()
        ));

        gameMeetings.forEach(game -> schedules.add(
                ScheduleResponseDto.builder()
                        .scheduleId(game.getId())
                        .schdlDttm(game.getSchdlDttm())
                        .type("game")
                        .childUserId(game.getChildUserEntity().getId())
                        .consultantName(game.getHost().getName())
                        .childName(game.getChildUserEntity().getName())
                        .parentName(game.getChildUserEntity().getParentUserEntity().getName())
                        .parentEmail(game.getChildUserEntity().getParentUserEntity().getEmail())
                        .status(game.getStatus())
                        .build()
        ));

        return schedules.stream()
                .sorted(Comparator.comparing(ScheduleResponseDto::getSchdlDttm))
                .collect(Collectors.toList());
    }


    @Override
    public List<String> getScheduleDatesByChildUserId(ScheduleSearchByChildRequestDto scheduleSearchByChildRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);

        if (!"ROLE_CONSULTANT".equals(role)) {
            throw new UserAccessDeniedException();
        }

        int childUserId = scheduleSearchByChildRequestDto.getChildId();
        int year = scheduleSearchByChildRequestDto.getYear();
        int month = scheduleSearchByChildRequestDto.getMonth();

        List<String> consultDates = consultMeetingScheduleRepository.findDatesByChildUserIdAndYearMonth(childUserId, year, month);

        List<String> gameDates = gameMeetingScheduleRepository.findDatesByChildUserIdAndYearMonth(childUserId, year, month);

        return Stream.concat(consultDates.stream(), gameDates.stream())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    @Override
    public List<ScheduleResponseDto> getSchedulesByChildUserId(ScheduleSearchByChildRequestDto scheduleSearchByChildRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);

        if (!"ROLE_CONSULTANT".equals(role)) {
            throw new UserAccessDeniedException();
        }

        int childUserId = scheduleSearchByChildRequestDto.getChildId();
        int year = scheduleSearchByChildRequestDto.getYear();
        int month = scheduleSearchByChildRequestDto.getMonth();

        List<ConsultMeetingScheduleEntity> consultMeetings = consultMeetingScheduleRepository.findByChildUserIdAndYearMonth(childUserId,year, month);

        List<GameMeetingScheduleEntity> gameMeetings = gameMeetingScheduleRepository.findByChildUserIdAndYearMonth(childUserId,year, month);

        List<ScheduleResponseDto> schedules = new ArrayList<>();

        consultMeetings.forEach(consult -> schedules.add(
                ScheduleResponseDto.builder()
                        .scheduleId(consult.getId())
                        .schdlDttm(consult.getSchdlDttm())
                        .type("consult")
                        .consultantName(consult.getHost().getName())
                        .childUserId(consult.getChildUserEntity().getId())
                        .childName(consult.getChildUserEntity().getName())
                        .parentName(consult.getParentUserEntity().getName())
                        .parentEmail(consult.getParentUserEntity().getEmail())
                        .status(consult.getStatus())
                        .build()
        ));

        gameMeetings.forEach(game -> schedules.add(
                ScheduleResponseDto.builder()
                        .scheduleId(game.getId())
                        .schdlDttm(game.getSchdlDttm())
                        .type("game")
                        .consultantName(game.getHost().getName())
                        .childUserId(game.getChildUserEntity().getId())
                        .childName(game.getChildUserEntity().getName())
                        .parentName(game.getChildUserEntity().getParentUserEntity().getName())
                        .parentEmail(game.getChildUserEntity().getParentUserEntity().getEmail())
                        .status(game.getStatus())
                        .build()
        ));

        return schedules.stream()
                .sorted(Comparator.comparing(ScheduleResponseDto::getSchdlDttm))
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getAvailableTimes(ScheduleAvailableTimeRequestDto scheduleAvailableTimeRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);

        if (!"ROLE_CONSULTANT".equals(role)) {
            throw new UserAccessDeniedException();
        }

        ConsultantUserEntity consultantUserEntity = consultantUserRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);

        Integer consultantUserId = consultantUserEntity.getId();
        LocalDate date = scheduleAvailableTimeRequestDto.getDate();

        List<String> bookedTimes = new ArrayList<>();
        bookedTimes.addAll(consultMeetingScheduleRepository.findBookedTimesByConsultant(consultantUserId, date));
        bookedTimes.addAll(gameMeetingScheduleRepository.findBookedTimesByConsultant(consultantUserId, date));

        List<String> allTimes = new ArrayList<>();
        LocalTime start = LocalTime.of(9, 0);  // 상담 시작 시간
        LocalTime end = LocalTime.of(18, 0);   // 상담 종료 시간

        while (start.isBefore(end)) {
            allTimes.add(start.toString());
            start = start.plusHours(1);
        }

        return allTimes.stream()
                .filter(time -> !bookedTimes.contains(time))
                .collect(Collectors.toList());
    }

    @Override
    public void createSchedule(ScheduleCreateRequestDto scheduleCreateRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String consultantEmail = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);

        if (!"ROLE_CONSULTANT".equals(role)) {
            throw new UserAccessDeniedException();
        }

        int consultantUserId = consultantUserRepository.findByEmail(consultantEmail)
                .orElseThrow(UserNotFoundException::new)
                .getId();

        Integer childUserId = scheduleCreateRequestDto.getChildId();
        LocalDateTime schdlDttm = scheduleCreateRequestDto.getSchdlDttm(); // LocalDateTime 사용
        String type = scheduleCreateRequestDto.getType();

        boolean isBooked = consultMeetingScheduleRepository.existsByConsultantAndDateTime(consultantUserId, schdlDttm)
                || gameMeetingScheduleRepository.existsByConsultantAndDateTime(consultantUserId, schdlDttm);

        if (isBooked) {
            throw new ScheduleConflictException();
        }

        if ("consult".equals(type)) {
            ChildUserEntity childUserEntity = childUserRepository.findById(childUserId).orElseThrow(UserNotFoundException::new);
            ParentUserEntity parentUserEntity = childUserEntity.getParentUserEntity();

            ConsultMeetingScheduleEntity consultSchedule = ConsultMeetingScheduleEntity.builder()
                    .host(consultantUserRepository.findById(consultantUserId)
                            .orElseThrow(UserNotFoundException::new))
                    .childUserEntity(childUserRepository.findById(childUserId)
                            .orElseThrow(UserNotFoundException::new))
                    .schdlDttm(schdlDttm)
                    .parentUserEntity(parentUserEntity)
                    .status("P")
                    .build();
            consultMeetingScheduleRepository.save(consultSchedule);
        } else if ("game".equals(type)) {
            GameMeetingScheduleEntity gameSchedule = GameMeetingScheduleEntity.builder()
                    .host(consultantUserRepository.findById(consultantUserId)
                            .orElseThrow(UserNotFoundException::new))
                    .childUserEntity(childUserRepository.findById(childUserId)
                            .orElseThrow(UserNotFoundException::new))
                    .schdlDttm(schdlDttm)  // LocalDateTime 직접 사용
                    .status("P")
                    .build();
            gameMeetingScheduleRepository.save(gameSchedule);
        } else {
            throw new InvalidScheduleException();
        }
    }

    @Override
    public void updateSchedule(ScheduleUpdateRequestDto scheduleUpdateRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String consultantEmail = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);

        if (!"ROLE_CONSULTANT".equals(role)) {
            throw new UserAccessDeniedException();
        }

        int consultantUserId = consultantUserRepository.findByEmail(consultantEmail)
                .orElseThrow(UserNotFoundException::new)
                .getId();

        Integer scheduleId = scheduleUpdateRequestDto.getId();
        String schdlDttm = scheduleUpdateRequestDto.getSchdlDttm().toString();
        String type = scheduleUpdateRequestDto.getType();

        if ("consult".equals(type)) {
            ConsultMeetingScheduleEntity consultSchedule = consultMeetingScheduleRepository.findById(scheduleId)
                    .orElseThrow(ScheduleNotFoundException::new);

            boolean isBooked = consultMeetingScheduleRepository.existsByConsultantAndDateTime(consultantUserId, LocalDateTime.parse(schdlDttm))
                    || gameMeetingScheduleRepository.existsByConsultantAndDateTime(consultantUserId, LocalDateTime.parse(schdlDttm));

            if (isBooked && !String.valueOf(consultSchedule.getSchdlDttm()).equals(schdlDttm)) {
                throw new ScheduleConflictException();
            }

            consultSchedule.setSchdlDttm(LocalDateTime.parse(schdlDttm));
            consultMeetingScheduleRepository.save(consultSchedule);

        } else if ("game".equals(type)) {
            GameMeetingScheduleEntity gameSchedule = gameMeetingScheduleRepository.findById(scheduleId)
                    .orElseThrow(ScheduleNotFoundException::new);

            boolean isBooked = consultMeetingScheduleRepository.existsByConsultantAndDateTime(consultantUserId, LocalDateTime.parse(schdlDttm))
                    || gameMeetingScheduleRepository.existsByConsultantAndDateTime(consultantUserId, LocalDateTime.parse(schdlDttm));

            if (isBooked && !String.valueOf(gameSchedule.getSchdlDttm()).equals(schdlDttm)) {
                throw new ScheduleConflictException();
            }

            gameSchedule.setSchdlDttm(LocalDateTime.parse(schdlDttm));
            gameMeetingScheduleRepository.save(gameSchedule);
        } else {
            throw new InvalidScheduleException();
        }
    }

    @Override
    public void deleteSchedule(ScheduleDeleteRequestDto scheduleDeleteRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);

        if (!"ROLE_CONSULTANT".equals(role)) {
            throw new UserAccessDeniedException();
        }

        int id = scheduleDeleteRequestDto.getId();
        String type = scheduleDeleteRequestDto.getType();

        if ("consult".equals(type)) {
            ConsultMeetingScheduleEntity consultSchedule = consultMeetingScheduleRepository.findById(id)
                    .orElseThrow(ScheduleNotFoundException::new);

            if (consultSchedule.getDeleteDttm() != null) {
                throw new ScheduleAlreadyDeletedException();
            }

            consultMeetingScheduleRepository.modifyDeleteDttmById(id);

        } else if ("game".equals(type)) {
            GameMeetingScheduleEntity gameSchedule = gameMeetingScheduleRepository.findById(id)
                    .orElseThrow(ScheduleNotFoundException::new);

            if (gameSchedule.getDeleteDttm() != null) {
                throw new ScheduleAlreadyDeletedException();
            }

            gameMeetingScheduleRepository.modifyDeleteDttmById(id);
        } else {
            throw new InvalidScheduleException();
        }
    }

    @Override
    public List<ScheduleResponseDto> getSchedulesByParentUserId(ScheduleSearchByParentRequestDto scheduleSearchByParentRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String parentEmail = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);

        if (!"ROLE_PARENT".equals(role)) {
            throw new UserAccessDeniedException();
        }

        int parentUserId = parentUserRepository.findByEmail(parentEmail)
                .orElseThrow(UserNotFoundException::new)
                .getId();

        int year = scheduleSearchByParentRequestDto.getYear();
        int month = scheduleSearchByParentRequestDto.getMonth();

        List<ChildUserEntity> childUserEntities = childUserRepository.findByParentUserEntity_IdAndDeleteDttmIsNull(parentUserId)
                .orElseThrow(UserNotFoundException::new);
        List<Integer> childUserIds = childUserEntities.stream().map(ChildUserEntity::getId).toList();

        if(childUserIds.isEmpty()){
            return List.of();
        }
        List<ScheduleResponseDto> schedules = new ArrayList<>();

        List<ConsultMeetingScheduleEntity> consultSchedules = consultMeetingScheduleRepository.findByChildUserIdsAndYearMonth(childUserIds, year, month);
        List<GameMeetingScheduleEntity> gameSchedules = gameMeetingScheduleRepository.findByChildUserIdsAndYearMonth(childUserIds, year, month);

        consultSchedules.forEach(consult -> schedules.add(
                ScheduleResponseDto.builder()
                        .scheduleId(consult.getId())
                        .schdlDttm(consult.getSchdlDttm())
                        .type("consult")
                        .consultantName(consult.getHost().getName())
                        .childUserId(consult.getChildUserEntity().getId())
                        .childName(consult.getChildUserEntity().getName())
                        .parentName(consult.getParentUserEntity().getName())
                        .parentEmail(consult.getParentUserEntity().getEmail())
                        .status(consult.getStatus())
                        .build()
        ));

        gameSchedules.forEach(game -> schedules.add(
                ScheduleResponseDto.builder()
                        .scheduleId(game.getId())
                        .schdlDttm(game.getSchdlDttm())
                        .type("game")
                        .consultantName(game.getHost().getName())
                        .childUserId(game.getChildUserEntity().getId())
                        .childName(game.getChildUserEntity().getName())
                        .parentName(game.getChildUserEntity().getParentUserEntity().getName())
                        .parentEmail(game.getChildUserEntity().getParentUserEntity().getEmail())
                        .status(game.getStatus())
                        .build()
        ));

        return schedules.stream()
                .sorted(Comparator.comparing(ScheduleResponseDto::getSchdlDttm))
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getScheduleDatesByParentUserId(ScheduleSearchByParentRequestDto scheduleSearchByParentRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String parentEmail = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);

        if (!"ROLE_PARENT".equals(role)) {
            throw new UserAccessDeniedException();
        }

        int parentUserId = parentUserRepository.findByEmail(parentEmail)
                .orElseThrow(UserNotFoundException::new)
                .getId();

        List<ChildUserEntity> childUserEntities = childUserRepository.findByParentUserEntity_IdAndDeleteDttmIsNull(parentUserId)
                .orElseThrow(UserNotFoundException::new);
        List<Integer> childUserIds = childUserEntities.stream().map(ChildUserEntity::getId).toList();

        if (childUserIds.isEmpty()) {
            return List.of();
        }

        int year = scheduleSearchByParentRequestDto.getYear();
        int month = scheduleSearchByParentRequestDto.getMonth();

        List<String> consultDates = consultMeetingScheduleRepository.findDatesByChildUserIdsAndYearMonth(childUserIds, year, month);
        List<String> gameDates = gameMeetingScheduleRepository.findDatesByChildUserIdsAndYearMonth(childUserIds, year, month);

        return Stream.concat(consultDates.stream(), gameDates.stream())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

}
