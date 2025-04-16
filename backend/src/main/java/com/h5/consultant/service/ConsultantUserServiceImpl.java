package com.h5.consultant.service;

import com.h5.child.entity.ChildUserEntity;
import com.h5.child.repository.ChildUserRepository;
import com.h5.consultant.dto.request.ModifyChildRequestDto;
import com.h5.consultant.dto.request.RegisterParentAccountDto;
import com.h5.consultant.dto.response.*;
import com.h5.consultant.entity.ConsultantUserEntity;
import com.h5.consultant.repository.ConsultantUserRepository;
import com.h5.file.entity.FileEntity;
import com.h5.file.service.FileService;
import com.h5.global.exception.MailSendException;
import com.h5.global.exception.UserNotFoundException;
import com.h5.global.util.MailUtil;
import com.h5.global.util.PasswordUtil;
import com.h5.parent.entity.ParentUserEntity;
import com.h5.parent.repository.ParentUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConsultantUserServiceImpl implements ConsultantUserService {

    private final ConsultantUserRepository consultantUserRepository;
    private final ParentUserRepository parentUserRepository;
    private final ChildUserRepository childUserRepository;
    private final PasswordUtil passwordUtil;
    private final PasswordEncoder passwordEncoder;
    private final MailUtil mailUtil;
    private final FileService fileService;

    @Autowired
    public ConsultantUserServiceImpl(ConsultantUserRepository consultantUserRepository,
                                     ParentUserRepository parentUserRepository,
                                     ChildUserRepository childUserRepository,
                                     PasswordUtil passwordUtil,
                                     PasswordEncoder passwordEncoder,
                                     MailUtil mailUtil,
                                     FileService fileService) {
        this.consultantUserRepository = consultantUserRepository;
        this.parentUserRepository = parentUserRepository;
        this.childUserRepository = childUserRepository;
        this.passwordUtil = passwordUtil;
        this.passwordEncoder = passwordEncoder;
        this.mailUtil = mailUtil;
        this.fileService = fileService;
    }

    private String getAuthenticatedEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    private int calculateAge(String birthDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate birthLocalDate = LocalDate.parse(birthDate, formatter);
        return Period.between(birthLocalDate, LocalDate.now()).getYears();
    }

    private String getFileUrl(FileEntity.TblType tblType, int tblId) {
        return !fileService.getFileUrl(tblType, tblId).isEmpty() ? fileService.getFileUrl(tblType, tblId).get(0).getUrl() : "Default Image";
    }

    @Override
    public ConsultantUserEntity findId(String name, String phone) {
        return consultantUserRepository.findEmailByNameAndPhone(name, phone)
                .orElseThrow(UserNotFoundException::new);
    }

    @Override
    public void updateToTempPwd(String name, String email) {
        ConsultantUserEntity consultantUser = consultantUserRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);

        String tempPwd = passwordUtil.generatePassword();
        consultantUser.setPwd(passwordEncoder.encode(tempPwd));
        consultantUser.setTempPwd(true);

        consultantUserRepository.save(consultantUser);
        mailUtil.sendTempPasswordEmail(email, email, tempPwd);
    }

    @Override
    public void updatePwd(String oldPwd, String newPwd) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        ConsultantUserEntity consultantUser = consultantUserRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);

        if (!passwordEncoder.matches(oldPwd, consultantUser.getPwd())) {
            throw new IllegalArgumentException("Old password does not match.");
        }

        consultantUser.setPwd(passwordEncoder.encode(newPwd));
        consultantUser.setTempPwd(false);

        consultantUserRepository.save(consultantUser);
    }

    @Override
    public RegisterParentAccountResponseDto registerParentAccount(RegisterParentAccountDto registerParentAccountDto) {
        String consultantEmail = getAuthenticatedEmail();

        ConsultantUserEntity consultantUser = consultantUserRepository.findByEmail(consultantEmail)
                .orElseThrow(UserNotFoundException::new);

        Optional<ParentUserEntity> optionalParentUser = parentUserRepository.findByEmail(registerParentAccountDto.getParentEmail());
        ParentUserEntity parentUser;
        String initPwd = null;

        if (optionalParentUser.isPresent()) {
            parentUser = optionalParentUser.get();
        } else {
            initPwd = passwordUtil.generatePassword();
            parentUser = ParentUserEntity.builder()
                    .name(registerParentAccountDto.getParentName())
                    .email(registerParentAccountDto.getParentEmail())
                    .pwd(passwordEncoder.encode(initPwd))
                    .phone(registerParentAccountDto.getParentPhone())
                    .tempPwd(true)
                    .consultantUserEntity(consultantUser)
                    .build();
            parentUser = parentUserRepository.save(parentUser);

            try {
                mailUtil.sendRegistrationEmail(registerParentAccountDto.getParentEmail(),
                        registerParentAccountDto.getParentEmail(), initPwd);
            } catch (Exception e) {
                throw new MailSendException("Failed to send registration email", e);
            }
        }

        ChildUserEntity childUser = ChildUserEntity.builder()
                .name(registerParentAccountDto.getChildName())
                .birth(LocalDate.parse(registerParentAccountDto.getChildBirth()))
                .gender(registerParentAccountDto.getChildGender())
                .firstConsultDt(LocalDate.parse(registerParentAccountDto.getFirstConsultDt()))
                .interest(registerParentAccountDto.getChildInterest())
                .additionalInfo(registerParentAccountDto.getChildAdditionalInfo())
                .parentUserEntity(parentUser)
                .consultantUserEntity(consultantUser)
                .build();

        childUser = childUserRepository.save(childUser);

        return RegisterParentAccountResponseDto.builder()
                .parentUserId(parentUser.getId())
                .childUserId(childUser.getId())
                .build();
    }

    @Transactional
    @Override
    public List<GetMyChildrenResponseDto> getChildrenForAuthenticatedConsultant() {
        String consultantEmail = getAuthenticatedEmail();

        ConsultantUserEntity consultantUser = consultantUserRepository.findByEmail(consultantEmail)
                .orElseThrow(UserNotFoundException::new);

        List<ChildUserEntity> childUsers = childUserRepository.findByConsultantUserEntity_IdAndDeleteDttmIsNull(consultantUser.getId())
                .orElse(new ArrayList<>());

        List<GetMyChildrenResponseDto> responseDtos = new ArrayList<>();
        for (ChildUserEntity child : childUsers) {
            responseDtos.add(
                    GetMyChildrenResponseDto.builder()
                            .childUserID(child.getId())
                            .profileImgUrl(getFileUrl(FileEntity.TblType.PCD, child.getId()))
                            .childName(child.getName())
                            .birth(String.valueOf(child.getBirth()))
                            .age(calculateAge(String.valueOf(child.getBirth())))
                            .parentName(child.getParentUserEntity().getName())
                            .build()
            );
        }
        return responseDtos;
    }

    @Transactional
    @Override
    public GetChildResponseDto getChild(int childUserId) {
        String consultantEmail = getAuthenticatedEmail();

        ConsultantUserEntity consultantUser = consultantUserRepository.findByEmail(consultantEmail)
                .orElseThrow(UserNotFoundException::new);

        ChildUserEntity childUser = childUserRepository.findByIdAndConsultantUserEntity_IdAndDeleteDttmIsNull(childUserId, consultantUser.getId())
                .orElseThrow(UserNotFoundException::new);

        return GetChildResponseDto.builder()
                .childUserId(childUser.getId())
                .profileImgUrl(getFileUrl(FileEntity.TblType.PCD, childUser.getId()))
                .childName(childUser.getName())
                .age(calculateAge(String.valueOf(childUser.getBirth())))
                .gender(childUser.getGender().equals("M") ? "남" : "여")
                .birth(String.valueOf(childUser.getBirth()))
                .firstConsultDate(String.valueOf(childUser.getFirstConsultDt()))
                .interest(childUser.getInterest())
                .additionalInfo(childUser.getAdditionalInfo())
                .parentName(childUser.getParentUserEntity().getName())
                .parentPhone(childUser.getParentUserEntity().getPhone())
                .parentEmail(childUser.getParentUserEntity().getEmail())
                .build();
    }

    @Override
    public MyProfileResponseDto getMyProfile() {
        String consultantEmail = getAuthenticatedEmail();

        ConsultantUserEntity consultantUser = consultantUserRepository.findByEmail(consultantEmail)
                .orElseThrow(UserNotFoundException::new);

        return MyProfileResponseDto.builder()
                .profileImgUrl(getFileUrl(FileEntity.TblType.PCT, consultantUser.getId()))
                .name(consultantUser.getName())
                .email(consultantUser.getEmail())
                .phone(consultantUser.getPhone())
                .centerName(consultantUser.getCenter().getCenterName())
                .centerPhone(consultantUser.getCenter().getCenterContact())
                .build();
    }

    @Override
    public EmailCheckResponseDto emailCheck(String email) {
        if (parentUserRepository.findByEmail(email).isEmpty()) {
            return EmailCheckResponseDto.builder()
                    .alreadyAccount(false)
                    .build();
        }

        ParentUserEntity parentUser = parentUserRepository.findByEmail(email)
                .orElseThrow(UserNotFoundException::new);

        return EmailCheckResponseDto.builder()
                .alreadyAccount(true)
                .email(email)
                .parentName(parentUser.getName())
                .parentPhone(parentUser.getPhone())
                .build();
    }


    @Transactional
    @Override
    public List<SearchChildResponseDto> searchChild(String childUserName) {
        List<ChildUserEntity> childUserEntities = childUserRepository.findALlByNameContainingAndDeleteDttmIsNull(childUserName)
                .orElseThrow(UserNotFoundException::new);

        return childUserEntities.stream()
                .map(child -> SearchChildResponseDto.builder()
                        .childUserId(child.getId())
                        .childProfileUrl(getFileUrl(FileEntity.TblType.PCD, child.getId()))
                        .childUserName(child.getName())
                        .parentUserName(child.getParentUserEntity().getName())
                        .parentUserEmail(child.getParentUserEntity().getEmail())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public ModifyChildResponseDto modifyChild(ModifyChildRequestDto modifyChildRequestDto) {
        ChildUserEntity childUserEntity = childUserRepository.findById(modifyChildRequestDto.getChildUserId())
                .orElseThrow(UserNotFoundException::new);

        childUserEntity.setInterest(modifyChildRequestDto.getInterest());
        childUserEntity.setAdditionalInfo(modifyChildRequestDto.getAdditionalInfo());

        return ModifyChildResponseDto.builder()
                .childUserId(childUserRepository.save(childUserEntity).getId())
                .build();
    }
}
