package com.h5.notice.service;

import com.h5.consultant.entity.ConsultantUserEntity;
import com.h5.consultant.repository.ConsultantUserRepository;
import com.h5.global.exception.*;
import com.h5.notice.dto.request.*;
import com.h5.notice.dto.response.*;
import com.h5.notice.entity.NoticeEntity;
import com.h5.notice.repository.NoticeRepository;
import com.h5.parent.entity.ParentUserEntity;
import com.h5.parent.repository.ParentUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional
public class NoticeServiceImpl implements NoticeService {

    private final NoticeRepository noticeRepository;
    private final ConsultantUserRepository consultantUserRepository;
    private final ParentUserRepository parentUserRepository;

    @Override
    public NoticeListResponseDto findAll(NoticeSearchRequestDto noticeSearchRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);

        Page<NoticeEntity> noticeEntityPage;

        Pageable pageable = PageRequest.of(
                noticeSearchRequestDto.getPageNumber(),
                noticeSearchRequestDto.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createDttm")
        );

        if ("ROLE_CONSULTANT".equals(role)) {
            ConsultantUserEntity consultantUser = consultantUserRepository.findByEmail(email)
                    .orElseThrow(UserNotFoundException::new);
            noticeEntityPage = noticeRepository.findAll(
                    consultantUser.getId(),
                    null,
                    pageable
            );
        } else if ("ROLE_PARENT".equals(role)) {
            ParentUserEntity parentUser = parentUserRepository.findByEmail(email)
                    .orElseThrow(UserNotFoundException::new);
            noticeEntityPage = noticeRepository.findAll(
                    null,
                    parentUser.getId(),
                    pageable
            );
        } else {
            throw new UserNotFoundException();
        }


        return convertToResponseDto(noticeEntityPage);
    }


    // 제목으로 검색
    @Override
    public NoticeListResponseDto findByTitle(NoticeSearchRequestDto noticeSearchRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);

        Page<NoticeEntity> noticeEntityPage;

        Pageable pageable = PageRequest.of(
                noticeSearchRequestDto.getPageNumber(),
                noticeSearchRequestDto.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createDttm")
        );

        if ("ROLE_CONSULTANT".equals(role)) {
            ConsultantUserEntity consultantUser = consultantUserRepository.findByEmail(email)
                    .orElseThrow(UserNotFoundException::new);
            noticeEntityPage = noticeRepository.findByTitle(
                    noticeSearchRequestDto.getKeyword(),
                    consultantUser.getId(),
                    null,
                    pageable
            );
        } else if ("ROLE_PARENT".equals(role)) {
            ParentUserEntity parentUser = parentUserRepository.findByEmail(email)
                    .orElseThrow(UserNotFoundException::new);
            noticeEntityPage = noticeRepository.findByTitle(
                    noticeSearchRequestDto.getKeyword(),
                    null,
                    parentUser.getId(),
                    pageable
            );
        } else {
            throw new UserNotFoundException();
        }


        return convertToResponseDto(noticeEntityPage);
    }

    @Override
    public NoticeListResponseDto findByName(NoticeSearchRequestDto noticeSearchRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);
        Pageable pageable = PageRequest.of(
                noticeSearchRequestDto.getPageNumber(),
                noticeSearchRequestDto.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createDttm")
        );

        Page<NoticeEntity> noticeEntityPage;

        if ("ROLE_CONSULTANT".equals(role)) {
            ConsultantUserEntity consultantUser = consultantUserRepository.findByEmail(email)
                    .orElseThrow(UserNotFoundException::new);
            noticeEntityPage = noticeRepository.findByName(
                    noticeSearchRequestDto.getKeyword(),
                    consultantUser.getId(),
                    null,
                    pageable
            );
        } else if ("ROLE_PARENT".equals(role)) {
            ParentUserEntity parentUser = parentUserRepository.findByEmail(email)
                    .orElseThrow(UserNotFoundException::new);
            noticeEntityPage = noticeRepository.findByName(
                    noticeSearchRequestDto.getKeyword(),
                    null,
                    parentUser.getId(),
                    pageable
            );
        } else {
            throw new UserNotFoundException();
        }

        return convertToResponseDto(noticeEntityPage);
    }

    @Override
    public NoticeDetailResponseDto findById(int noticeId) {
        NoticeEntity noticeEntity = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new BoardNotFoundException("notice"));

        updateViewCnt(noticeId); // 조회수 증가

        return NoticeDetailResponseDto.builder()
                .id(noticeEntity.getId())
                .title(noticeEntity.getTitle())
                .content(noticeEntity.getContent())
                .name(noticeEntity.getConsultantUser().getName())
                .viewCnt(noticeEntity.getViewCnt() + 1)
                .createDttm(noticeEntity.getCreateDttm().toString())
                .deleteDttm(noticeEntity.getDeleteDttm().toString())
                .build();
    }

    @Override
    public void updateViewCnt(int id) {
        noticeRepository.updateViewCnt(id);
    }

    @Override
    public NoticeSaveResponseDto createNotice(NoticeCreateRequestDto noticeCreateRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);

        ConsultantUserEntity consultantUser = consultantUserRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);

        if (!"ROLE_CONSULTANT".equals(role)) {
            throw new BoardAccessDeniedException("notice");
        }

        NoticeEntity noticeEntity = NoticeEntity.builder()
                .title(noticeCreateRequestDto.getTitle())
                .content(noticeCreateRequestDto.getContent())
                .consultantUser(consultantUser)
                .build();

        noticeRepository.save(noticeEntity);

        return NoticeSaveResponseDto.builder().noticeId(noticeEntity.getId()).build();
    }

    @Override
    public NoticeSaveResponseDto deleteNotice(int noticeId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        ConsultantUserEntity loginUser = consultantUserRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);

        NoticeEntity noticeEntity = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new BoardNotFoundException("notice"));

        if (!Objects.equals(loginUser.getId(), noticeEntity.getConsultantUser().getId())) {
            throw new BoardAccessDeniedException("notice");
        }

        noticeRepository.updateDeleteDttmById(noticeId);

        return NoticeSaveResponseDto.builder().noticeId(noticeEntity.getId()).build();
    }

    @Override
    public NoticeSaveResponseDto updateNotice(NoticeUpdateRequestDto noticeUpdateRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        ConsultantUserEntity loginUser = consultantUserRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);

        NoticeEntity noticeEntity = noticeRepository.findById(noticeUpdateRequestDto.getId())
                .orElseThrow(() -> new BoardNotFoundException("notice"));

        if (!Objects.equals(loginUser.getId(), noticeEntity.getConsultantUser().getId())) {
            throw new BoardAccessDeniedException("notice");
        }

        noticeEntity.setTitle(noticeUpdateRequestDto.getTitle());
        noticeEntity.setContent(noticeUpdateRequestDto.getContent());

        noticeRepository.save(noticeEntity);

        return NoticeSaveResponseDto.builder().noticeId(noticeEntity.getId()).build();
    }

    private NoticeListResponseDto convertToResponseDto(Page<NoticeEntity> noticeEntityPage) {
        List<NoticeResponseDto> noticeResponses = noticeEntityPage.getContent().stream()
                .map(noticeEntity -> new NoticeResponseDto(
                        noticeEntity.getId(),
                        noticeEntity.getTitle(),
                        noticeEntity.getConsultantUser().getName(),
                        noticeEntity.getViewCnt(),
                        noticeEntity.getCreateDttm().toString()
                )).toList();

        PaginationResponseDto pagination = new PaginationResponseDto(
                noticeEntityPage.getNumber(),
                noticeEntityPage.getSize(),
                noticeEntityPage.getTotalPages(),
                noticeEntityPage.getTotalElements()
        );

        return new NoticeListResponseDto(noticeResponses, pagination);
    }
}
