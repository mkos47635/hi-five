package com.h5.qna.service;

import com.h5.consultant.entity.ConsultantUserEntity;
import com.h5.consultant.repository.ConsultantUserRepository;
import com.h5.file.dto.response.GetFileUrlResponseDto;
import com.h5.file.entity.FileEntity;
import com.h5.file.service.FileService;
import com.h5.global.exception.*;
import com.h5.parent.entity.ParentUserEntity;
import com.h5.parent.repository.ParentUserRepository;
import com.h5.qna.dto.request.*;
import com.h5.qna.dto.response.*;
import com.h5.qna.entity.QnaAnswerEntity;
import com.h5.qna.entity.QnaEntity;
import com.h5.qna.repository.QnaAnswerRepository;
import com.h5.qna.repository.QnaRepository;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class QnaServiceImpl implements QnaService {
    private final QnaRepository qnaRepository;
    private final QnaAnswerRepository qnaAnswerRepository;
    private final ConsultantUserRepository consultantUserRepository;
    private final ParentUserRepository parentUserRepository;
    private final FileService fileService;

    @Override
    public QnaSaveResponseDto createQna(QnaCreateRequestDto qnaCreateRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        ParentUserEntity parentUser = parentUserRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);

        QnaEntity qnaEntity = QnaEntity.builder()
                .title(qnaCreateRequestDto.getTitle())
                .content(qnaCreateRequestDto.getContent())
                .parentUser(parentUser)
                .build();

        qnaRepository.save(qnaEntity);
        return QnaSaveResponseDto.builder().qnaId(qnaEntity.getId()).build();
    }

    // 전체 리스트 조회
    @Override
    public QnaListResponseDto findAll(QnaSearchRequestDto qnaSearchRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);

        Pageable pageable = PageRequest.of(
                qnaSearchRequestDto.getPageNumber(),
                qnaSearchRequestDto.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createDttm")
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
        }else{
            throw new UserAccessDeniedException();
        }

        Page<QnaEntity> qnaEntityPage = qnaRepository.findAll(role, parentUserId, consultantUserId, pageable);

        return convertToResponseDto(qnaEntityPage);
    }


    // 제목 검색
    @Override
    public QnaListResponseDto findByTitle(QnaSearchRequestDto qnaSearchRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);
        Pageable pageable = PageRequest.of(
                qnaSearchRequestDto.getPageNumber(),
                qnaSearchRequestDto.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createDttm")
        );
        String title = qnaSearchRequestDto.getKeyword();
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
        }else{
            throw new UserAccessDeniedException();
        }

        Page<QnaEntity> qnaEntityPage = qnaRepository.findByTitle(role, parentUserId, consultantUserId, title, pageable);

        return convertToResponseDto(qnaEntityPage);
    }

    // 작성자 검색
    @Override
    public QnaListResponseDto findByName(QnaSearchRequestDto qnaSearchRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);
        Pageable pageable = PageRequest.of(
                qnaSearchRequestDto.getPageNumber(),
                qnaSearchRequestDto.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createDttm")
        );
        String searchName = qnaSearchRequestDto.getKeyword();
        Integer parentUserId = null;
        Integer consultantUserId = null;

        if ("ROLE_PARENT".equals(role)) {
            parentUserId = parentUserRepository.findByEmail(email)
                    .orElseThrow(UserNotFoundException::new)
                    .getId();
        }

        if ("ROLE_CONSULTANT".equals(role)) {
            consultantUserId = consultantUserRepository.findByEmail(email)
                    .orElseThrow(UserNotFoundException::new)
                    .getId();
        }

        Page<QnaEntity> qnaEntityPage = qnaRepository.findByName(role, parentUserId, consultantUserId, searchName, pageable);

        return convertToResponseDto(qnaEntityPage);
    }

    //상세조회
    @Override
    public QnaDetailResponseDto findById(int qnaId) {
        QnaEntity qnaEntity = qnaRepository.findById(qnaId)
                .orElseThrow(() -> new BoardNotFoundException("qna"));

        List<QnaAnswerEntity> qnaAnswerEntityList = qnaAnswerRepository.findByQnaEntity_IdAndDeleteDttmIsNull(qnaId);

        List<QnaAnswerResponseDto> qnaAnswerResponseList = qnaAnswerEntityList.stream()
                .map(answer -> {
                    List<GetFileUrlResponseDto> profileImages = fileService.getFileUrl(FileEntity.TblType.PCT, answer.getConsultantUser().getId());

                    String profileImageUrl = profileImages.isEmpty() ? null : profileImages.get(0).getUrl();

                    return QnaAnswerResponseDto.builder()
                            .id(answer.getId())
                            .content(answer.getContent())
                            .createDttm(answer.getCreateDttm().toString())
                            .name(answer.getConsultantUser().getName())
                            .profileImageUrl(profileImageUrl)
                            .build();
                })
                .toList();

        return QnaDetailResponseDto.builder()
                .id(qnaEntity.getId())
                .title(qnaEntity.getTitle())
                .content(qnaEntity.getContent())
                .name(qnaEntity.getParentUser().getName())
                .createDttm(qnaEntity.getCreateDttm().toString())
                .answerCnt(qnaAnswerRepository.countByQnaEntity_Id(qnaEntity.getId()))
                .DeleteDttm(qnaEntity.getDeleteDttm().toString())
                .qnaAnswerResponseList(qnaAnswerResponseList)
                .build();
    }

    //업데이트
    @Override
    public QnaSaveResponseDto updateQna(QnaUpdateRequestDto qnaUpdateRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        ParentUserEntity parentUser = parentUserRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);
        QnaEntity qnaEntity = qnaRepository.findById(qnaUpdateRequestDto.getId())
                .orElseThrow(() -> new BoardNotFoundException("qna"));

        if(!Objects.equals(parentUser.getId(), qnaEntity.getParentUser().getId())) {
            throw new BoardAccessDeniedException("qna");
        }

        qnaEntity.setTitle(qnaUpdateRequestDto.getTitle());
        qnaEntity.setContent(qnaUpdateRequestDto.getContent());

        qnaRepository.save(qnaEntity);
        return QnaSaveResponseDto.builder().qnaId(qnaEntity.getId()).build();
    }

    //글 삭제
    @Override
    public QnaSaveResponseDto deleteQna(int qnaId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse(null);

        QnaEntity qnaEntity = qnaRepository.findById(qnaId).orElseThrow(() -> new BoardNotFoundException("qna"));

        if("ROLE_PARENT".equals(role)) {
            ParentUserEntity parentUserEntity = parentUserRepository.findByEmail(email).orElseThrow(UserNotFoundException::new);
            if(qnaEntity.getParentUser().getId().equals(parentUserEntity.getId())) {
                qnaEntity.setDeleteDttm(LocalDateTime.now());
                qnaRepository.save(qnaEntity);

                return QnaSaveResponseDto.builder().qnaId(qnaEntity.getId()).build();
            }

        }else if("ROLE_CONSULTANT".equals(role)) {
            ConsultantUserEntity consultantUserEntity = consultantUserRepository.findByEmail(email).orElseThrow(UserNotFoundException::new);
            if(qnaEntity.getParentUser().getConsultantUserEntity().getId().equals(consultantUserEntity.getId())) {
                qnaEntity.setDeleteDttm(LocalDateTime.now());
                qnaRepository.save(qnaEntity);

                return QnaSaveResponseDto.builder().qnaId(qnaEntity.getId()).build();
            }
        }

        throw new InvalidUserException("role");
    }

    @Override
    public QnaCommentResponseDto createQnaComment(QnaCommentCreateRequestDto qnaCommentCreateRequestDto) {
        QnaEntity qnaEntity = qnaRepository.findById(qnaCommentCreateRequestDto.getQnaId())
                .orElseThrow(() -> new BoardNotFoundException("qna"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        ConsultantUserEntity consultantUser = consultantUserRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);

        QnaAnswerEntity qnaAnswerEntity = new QnaAnswerEntity().builder()
                .content(qnaCommentCreateRequestDto.getContent())
                .qnaEntity(qnaEntity)
                .consultantUser(consultantUser)
                .build();

        qnaAnswerRepository.save(qnaAnswerEntity);

        return QnaCommentResponseDto.builder()
                .qnaAnswerId(qnaAnswerEntity.getId())
                .qnaId(qnaEntity.getId())
                .build();
    }

    @Override
    public QnaCommentResponseDto updateComment(QnaCommentUpdateRequestDto qnaCommentUpdateRequestDto) {
        QnaAnswerEntity qnaAnswerEntity = qnaAnswerRepository.findById(qnaCommentUpdateRequestDto.getQnaCommentId())
                .orElseThrow(() -> new BoardNotFoundException("qna_Answer"));

        qnaAnswerEntity.setContent(qnaCommentUpdateRequestDto.getContent());
        qnaAnswerRepository.save(qnaAnswerEntity);

        return QnaCommentResponseDto.builder()
                .qnaAnswerId(qnaAnswerEntity.getId())
                .qnaId(qnaAnswerEntity.getQnaEntity().getId())
                .build();
    }

    @Override
    public QnaCommentResponseDto deleteComment(int qnaCommentId) {
        QnaAnswerEntity qnaAnswerEntity = qnaAnswerRepository.findById(qnaCommentId)
                .orElseThrow(() -> new BoardAccessDeniedException("qna_Answer"));
        qnaAnswerEntity.setDeleteDttm(LocalDateTime.now());
        qnaAnswerRepository.save(qnaAnswerEntity);

        return QnaCommentResponseDto.builder()
                .qnaAnswerId(qnaAnswerEntity.getId())
                .qnaId(qnaAnswerEntity.getQnaEntity().getId())
                .build();
    }

    private QnaListResponseDto convertToResponseDto(Page<QnaEntity> qnaEntityPage) {
        List<QnaResponseDto> qnaResponses = qnaEntityPage.getContent().stream()
                .map(qnaEntity -> new QnaResponseDto(
                        qnaEntity.getId(),
                        qnaEntity.getTitle(),
                        qnaEntity.getParentUser().getName(),
                        qnaEntity.getCreateDttm().toString(),
                        qnaAnswerRepository.countByQnaEntity_Id(qnaEntity.getId())
                ))
                .collect(Collectors.toList());

        PaginationResponseDto pagination = new PaginationResponseDto(
                qnaEntityPage.getNumber(),
                qnaEntityPage.getSize(),
                qnaEntityPage.getTotalPages(),
                qnaEntityPage.getTotalElements()
        );

        return new QnaListResponseDto(qnaResponses, pagination);
    }
}
