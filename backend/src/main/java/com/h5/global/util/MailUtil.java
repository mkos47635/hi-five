package com.h5.global.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class MailUtil {

    private final JavaMailSender javaMailSender;
    private static final String TEMP_PWD_SUBJECT = "[h5] 임시 비밀번호 발급";
    private static final String TEMP_PWD_MESSAGE_TEMPLATE =
            """
            요청하신 임시 비밀번호를 발급해 드립니다.

            아이디 : %s
            임시 비밀번호 : %s

            첫 로그인 시 반드시 비밀번호를 변경해 주시기 바랍니다.
            감사합니다.
            """;

    private static final String REGIST_SUBJECT = "[h5] 회원 등록 알림";
    private static final String REGIST_MESSAGE_TEMPLATE =
            """
            안녕하세요. h5입니다.

            회원 등록이 완료되었습니다.

            아이디 : %s
            초기 비밀번호 : %s

            첫 로그인 시 반드시 비밀번호를 변경해 주시기 바랍니다.
            h5 웹사이트 서비스를 이용해 주셔서 감사합니다.

            항상 최선을 다해 서비스를 제공하겠습니다.
            """;

    @Autowired
    public MailUtil(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }


    public void sendTempPasswordEmail(String to, String userId, String tempPwd) {
        String text = String.format(TEMP_PWD_MESSAGE_TEMPLATE, userId, tempPwd);
        sendEmail(to, TEMP_PWD_SUBJECT, text);
    }

    public void sendRegistrationEmail(String to, String userId, String initPwd) {
        String text = String.format(REGIST_MESSAGE_TEMPLATE, userId, initPwd);
        sendEmail(to, REGIST_SUBJECT, text);
    }

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        javaMailSender.send(message);
    }
}

