package com.h5.global.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class PasswordUtil {

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int TEMP_PASSWORD_LENGTH = 10;

    public String generatePassword() {
        SecureRandom random = new SecureRandom();
        StringBuilder tempPassword = new StringBuilder();

        for (int i = 0; i < TEMP_PASSWORD_LENGTH; i++) {
            int index = random.nextInt(CHARACTERS.length());
            tempPassword.append(CHARACTERS.charAt(index));
        }

        return tempPassword.toString();
    }
}
