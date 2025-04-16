package com.h5.deleterequest.service;

import com.h5.child.entity.ChildUserEntity;
import com.h5.child.repository.ChildUserRepository;
import com.h5.deleterequest.dto.response.*;
import com.h5.deleterequest.entity.DeleteUserRequestEntity;
import com.h5.deleterequest.repository.DeleteUserRequestRepository;
import com.h5.file.entity.FileEntity;
import com.h5.file.service.FileService;
import com.h5.global.exception.UserNotFoundException;
import com.h5.parent.entity.ParentUserEntity;
import com.h5.parent.repository.ParentUserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DeleteUserRequestServiceImpl implements DeleteUserRequestService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final DeleteUserRequestRepository deleteUserRequestRepository;
    private final ParentUserRepository parentUserRepository;
    private final ChildUserRepository childUserRepository;
    private final FileService fileService;

    @Autowired
    public DeleteUserRequestServiceImpl(DeleteUserRequestRepository deleteUserRequestRepository,
                                        ParentUserRepository parentUserRepository,
                                        ChildUserRepository childUserRepository,
                                        FileService fileService) {
        this.deleteUserRequestRepository = deleteUserRequestRepository;
        this.parentUserRepository = parentUserRepository;
        this.childUserRepository = childUserRepository;
        this.fileService = fileService;
    }

    @Transactional
    @Override
    public DeleteRequestResponseDto deleteRequest() {
        String parentEmail = getAuthenticatedUserEmail();
        ParentUserEntity parentUserEntity = parentUserRepository.findByEmailAndDeleteDttmIsNull(parentEmail)
                .orElseThrow(UserNotFoundException::new);

        // 이미 삭제 요청이 존재하는지 체크 (예: P(진행중) 상태라면 중복 요청으로 판단)
        Optional<DeleteUserRequestEntity> existingRequest =
                deleteUserRequestRepository.findByParentUser_IdAndStatus(parentUserEntity.getId(), DeleteUserRequestEntity.Status.P);

        if (existingRequest.isPresent()) {
            return DeleteRequestResponseDto.builder()
                    .deleteRequestId(existingRequest.get().getId())
                    .status(existingRequest.get().getStatus())
                    .deleteRequestDttm(existingRequest.get().getDeleteRequestDttm())
                    .duplicate(true)
                    .build();
        }

        DeleteUserRequestEntity deleteUserRequest = deleteUserRequestRepository.save(
                DeleteUserRequestEntity.builder()
                        .status(DeleteUserRequestEntity.Status.P)
                        .parentUser(parentUserEntity)
                        .consultantUser(parentUserEntity.getConsultantUserEntity())
                        .deleteRequestDttm(LocalDateTime.now().toString())
                        .build());

        return DeleteRequestResponseDto.builder()
                .deleteRequestId(deleteUserRequest.getId())
                .status(deleteUserRequest.getStatus())
                .deleteRequestDttm(deleteUserRequest.getDeleteRequestDttm())
                .duplicate(false)
                .build();
    }

    @Transactional
    @Override
    public DeleteUserRequestAprproveResponseDto deleteApprove(int deleteUserRequestId) {
        DeleteUserRequestEntity deleteUserRequestEntity = deleteUserRequestRepository.findById(deleteUserRequestId)
                .orElseThrow(UserNotFoundException::new);

        String deleteDttm = getDatetimeStr();

        Set<Integer> childUserIds = deleteUserRequestEntity.getParentUser().getChildUserEntities()
                .stream()
                .map(ChildUserEntity::getId)
                .collect(Collectors.toSet());
        childUserRepository.updateDeleteDttmForChildUsers(childUserIds, deleteDttm);

        // Update parent user
        ParentUserEntity parentUserEntity = deleteUserRequestEntity.getParentUser();
        parentUserEntity.setDeleteDttm(deleteDttm);
        parentUserRepository.save(parentUserEntity);

        // Update delete request entity
        deleteUserRequestEntity.setDeleteConfirmDttm(deleteDttm);
        deleteUserRequestEntity.setStatus(DeleteUserRequestEntity.Status.A);

        DeleteUserRequestEntity deleteUserRequest = deleteUserRequestRepository.save(deleteUserRequestEntity);

        return DeleteUserRequestAprproveResponseDto.builder()
                .deleteRequestId(deleteUserRequest.getId())
                .deleteConfirmDttm(deleteUserRequest.getDeleteConfirmDttm())
                .status(deleteUserRequest.getStatus())
                .build();
    }

    @Transactional
    @Override
    public DeleteUserRequestRejectResponseDto deleteReject(int deleteUserRequestId) {
        DeleteUserRequestEntity deleteUserRequestEntity = deleteUserRequestRepository.findById(deleteUserRequestId)
                .orElseThrow(UserNotFoundException::new);

        deleteUserRequestEntity.setDeleteConfirmDttm(getDatetimeStr());
        deleteUserRequestEntity.setStatus(DeleteUserRequestEntity.Status.R);

        DeleteUserRequestEntity deleteUserRequest = deleteUserRequestRepository.save(deleteUserRequestEntity);

        return DeleteUserRequestRejectResponseDto.builder()
                .deleteRequestId(deleteUserRequest.getId())
                .status(deleteUserRequest.getStatus())
                .deleteConfirmDttm(deleteUserRequest.getDeleteConfirmDttm())
                .build();
    }

    @Transactional
    @Override
    public List<GetMyDeleteResponseDto> getMyDelete() {
        String consultantEmail = getAuthenticatedUserEmail();

        return deleteUserRequestRepository.findALlByStatusAndConsultantUser_Email(DeleteUserRequestEntity.Status.P, consultantEmail)
                .stream()
                .map(deleteUserRequestEntity -> {
                    Set<GetMyDeleteChildResponseDto> childDtos = deleteUserRequestEntity.getParentUser().getChildUserEntities()
                            .stream()
                            .map(childUserEntity -> GetMyDeleteChildResponseDto.builder()
                                    .childUserId(childUserEntity.getId())
                                    .childName(childUserEntity.getName())
                                    .childUserProfileUrl(getFileUrl(childUserEntity.getId()))
                                    .gender(childUserEntity.getGender())
                                    .age(getAge(childUserEntity.getBirth().toString()))
                                    .parentUserPhone(childUserEntity.getParentUserEntity().getPhone())
                                    .parentUserName(childUserEntity.getParentUserEntity().getName())
                                    .birth(childUserEntity.getBirth().toString())
                                    .parentUserEmail(childUserEntity.getParentUserEntity().getEmail())
                                    .firConsultDt(childUserEntity.getFirstConsultDt().toString())
                                    .interest(childUserEntity.getInterest())
                                    .additionalInfo(childUserEntity.getAdditionalInfo())
                                    .build())
                            .collect(Collectors.toSet());

                    return GetMyDeleteResponseDto.builder()
                            .deleteUserRequestId(deleteUserRequestEntity.getId())
                            .deleteRequestDttm(deleteUserRequestEntity.getDeleteRequestDttm())
                            .parentUserId(deleteUserRequestEntity.getParentUser().getId())
                            .parentName(deleteUserRequestEntity.getParentUser().getName())
                            .children(childDtos)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private String getAuthenticatedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    private int getAge(String birth) {
        LocalDate childBirthDate = LocalDate.parse(birth, DATE_FORMATTER);
        return Period.between(childBirthDate, LocalDate.now()).getYears();
    }

    private String getDatetimeStr() {
        return LocalDateTime.now().format(DATETIME_FORMATTER);
    }

    private String getFileUrl(int tblId) {
        return !fileService.getFileUrl(FileEntity.TblType.PCD, tblId).isEmpty() ? fileService.getFileUrl(FileEntity.TblType.PCD, tblId).get(0).getUrl() : "Default Image";
    }
}
