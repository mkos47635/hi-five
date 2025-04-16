package com.h5.faq.service;

import com.h5.consultant.entity.ConsultantUserEntity;
import com.h5.consultant.repository.ConsultantUserRepository;
import com.h5.faq.dto.request.FaqCreateRequestDto;
import com.h5.faq.dto.request.FaqSearchRequestDto;
import com.h5.faq.dto.request.FaqUpdateRequestDto;
import com.h5.faq.dto.response.*;
import com.h5.faq.entity.FaqEntity;
import com.h5.faq.repository.FaqRepository;
import com.h5.global.exception.*;
import com.h5.parent.repository.ParentUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional
public class FaqServiceImpl implements FaqService {
    private final FaqRepository faqRepository;
    private final ConsultantUserRepository consultantUserRepository;
    private final ParentUserRepository parentUserRepository;

    //c
    //글 등록
    @Override
    public FaqSaveResponseDto createFaq(FaqCreateRequestDto faqCreateRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        ConsultantUserEntity consultantUser = consultantUserRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);


        FaqEntity faqEntity = FaqEntity.builder()
                .title(faqCreateRequestDto.getTitle())
                .faqAns(faqCreateRequestDto.getFaqAnswer())
                .consultantUser(consultantUser)
                .type(faqCreateRequestDto.getType())
                .build();

        faqRepository.save(faqEntity);

        return FaqSaveResponseDto.builder()
                .faqId(faqEntity.getId())
                .build();
    }

    //r
    //전체 목록
    @Override
    public FaqListResponseDto findAll(FaqSearchRequestDto faqSearchRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);
        Pageable pageable = PageRequest.of(
                faqSearchRequestDto.getPageNumber(),
                faqSearchRequestDto.getPageSize(),
                Sort.by(Sort.Direction.DESC, "id")
        );

        Integer parentUserId = null;
        Integer consultantUserId = null;

        if ("ROLE_PARENT".equals(role)) {
            parentUserId = parentUserRepository.findByEmail(email)
                    .orElseThrow(UserNotFoundException::new)
                    .getId();
        } else if ("ROLE_CONSULTANT".equals(role)) {
            consultantUserId = consultantUserRepository.findByEmail(email)
                    .orElseThrow(UserNotFoundException::new)
                    .getId();
        } else {
            throw new InvalidUserException("Invalid role");
        }


        Page<FaqEntity> faqEntityPage = faqRepository.findAll(role, parentUserId, consultantUserId, pageable);

        return convertToResponseDto(faqEntityPage);
    }

    //제목으로 검색
    @Override
    public FaqListResponseDto findByTitle(FaqSearchRequestDto faqSearchRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);

        String searchTitle = faqSearchRequestDto.getKeyword();
        Pageable pageable = PageRequest.of(
                faqSearchRequestDto.getPageNumber(),
                faqSearchRequestDto.getPageSize(),
                Sort.by(Sort.Direction.DESC, "id")
        );

        Integer parentUserId = null;
        Integer consultantUserId = null;

        if ("ROLE_PARENT".equals(role)) {
            parentUserId = parentUserRepository.findByEmail(email)
                    .orElseThrow(UserNotFoundException::new)
                    .getId();
        } else if ("ROLE_CONSULTANT".equals(role)) {
            consultantUserId = consultantUserRepository.findByEmail(email)
                    .orElseThrow(UserNotFoundException::new)
                    .getId();
        } else {
            throw new InvalidUserException("Invalid role");
        }


        Page<FaqEntity> faqEntityPage= faqRepository.findByTitle(role, parentUserId, consultantUserId, searchTitle, pageable);

        return convertToResponseDto(faqEntityPage);
    }

    //이메일로 검색
    @Override
    public FaqListResponseDto findByEmail(FaqSearchRequestDto faqSearchRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);

        String searchEmail = faqSearchRequestDto.getKeyword();
        Pageable pageable = PageRequest.of(
                faqSearchRequestDto.getPageNumber(),
                faqSearchRequestDto.getPageSize(),
                Sort.by(Sort.Direction.DESC, "id")
        );

        Integer parentUserId = null;
        Integer consultantUserId = null;

        if ("ROLE_PARENT".equals(role)) {
            parentUserId = parentUserRepository.findByEmail(email)
                    .orElseThrow(UserNotFoundException::new)
                    .getId();
        } else if ("ROLE_CONSULTANT".equals(role)) {
            consultantUserId = consultantUserRepository.findByEmail(email)
                    .orElseThrow(UserNotFoundException::new)
                    .getId();
        } else {
            throw new InvalidUserException("Invalid role");
        }


        Page<FaqEntity> faqEntityPage= faqRepository.findByEmail(role, parentUserId, consultantUserId, searchEmail, pageable);

        return convertToResponseDto(faqEntityPage);
    }

    //상세 조회
    @Override
    public FaqDetailResponseDto findById(int id) {
        FaqEntity faqEntity = faqRepository.findById(id)
                .orElseThrow(() -> new BoardNotFoundException("faq"));

        return FaqDetailResponseDto.builder()
                .id(faqEntity.getId())
                .title(faqEntity.getTitle())
                .faqAnswer(faqEntity.getFaqAns())
                .name(faqEntity.getConsultantUser().getName())
                .type(faqEntity.getType())
                .build();
    }

    //u
    //글수정
    @Override
    public FaqSaveResponseDto updateFaq(FaqUpdateRequestDto faqUpdateRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        ConsultantUserEntity consultantUser = consultantUserRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);
        FaqEntity faqEntity = faqRepository.findById(faqUpdateRequestDto.getFaqId())
                .orElseThrow(() -> new BoardNotFoundException("faq"));

        if(!Objects.equals(consultantUser.getId(), faqEntity.getConsultantUser().getId())) {
            throw new BoardAccessDeniedException("faq");
        }

        faqEntity.setTitle(faqUpdateRequestDto.getFaqTitle());
        faqEntity.setFaqAns(faqUpdateRequestDto.getFaqAnswer());

        faqRepository.save(faqEntity);
        return FaqSaveResponseDto.builder().faqId(faqEntity.getId()).build();
    }

    //d
    //글삭제
    @Override
    public FaqSaveResponseDto deleteFaq(int id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        ConsultantUserEntity consultantUser = consultantUserRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);
        FaqEntity faqEntity = faqRepository.findById(id)
                .orElseThrow(() -> new BoardNotFoundException("faq"));

        if(!Objects.equals(consultantUser.getId(), faqEntity.getConsultantUser().getId())) {
            throw new BoardAccessDeniedException("faq");
        }

        faqRepository.deleteById(id);

        return FaqSaveResponseDto.builder().faqId(faqEntity.getId()).build();
    }


    private FaqListResponseDto convertToResponseDto(Page<FaqEntity> faqEntityPage) {
        List<FaqResponseDto> faqResponses = faqEntityPage.getContent().stream()
                .map(faqEntity -> new FaqResponseDto(
                        faqEntity.getId(),
                        faqEntity.getTitle(),
                        faqEntity.getConsultantUser().getName(),
                        faqEntity.getFaqAns(),
                        faqEntity.getType()
                )).toList();

        PaginationResponseDto pagination = new PaginationResponseDto(
                faqEntityPage.getNumber(),
                faqEntityPage.getSize(),
                faqEntityPage.getTotalPages(),
                faqEntityPage.getTotalElements()
        );

        return new FaqListResponseDto(faqResponses, pagination);
    }
}
