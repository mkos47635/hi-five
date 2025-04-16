package com.h5.session.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class OpenViduServiceImpl implements OpenViduService {

    private final ObjectMapper objectMapper;
    @Value("${openvidu.url}")
    private String openviduUrl;

    @Value("${openvidu.secret}")
    private String openviduSecret;

    private final RestTemplate restTemplate;

    @Override
    public String createSession() {
        String url = openviduUrl + "/api/sessions";

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth("OPENVIDUAPP", openviduSecret);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String customSessionId = UUID.randomUUID().toString();
        String payload = "{ \"customSessionId\": \"" + customSessionId + "\" }";

        HttpEntity<String> request = new HttpEntity<>(payload, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        // HttpStatus.OK 외에 CREATED도 성공 상태로 인정합니다.
        if (response.getStatusCode() == HttpStatus.OK || response.getStatusCode() == HttpStatus.CREATED) {
            return customSessionId;
        } else {
            throw new RuntimeException("Failed to create OpenVidu session");
        }
    }


//    @Override
//    public String createToken(String sessionId) {
//        String url = openviduUrl + "/api/tokens";
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setBasicAuth("OPENVIDUAPP", openviduSecret);
//        headers.setContentType(MediaType.APPLICATION_JSON);
//
//        String payload = "{ \"session\": \"" + sessionId + "\", \"role\": \"PUBLISHER\" }";
//
//        HttpEntity<String> request = new HttpEntity<>(payload, headers);
//        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
//
//        if (response.getStatusCode() == HttpStatus.OK) {
//            try {
//                return objectMapper.readTree(response.getBody()).get("token").asText();
//            } catch (JsonProcessingException e) {
//                throw new RuntimeException(e);
//            }
//        } else {
//            throw new RuntimeException("Failed to create OpenVidu token");
//        }
//    }

    public String createConnection(String sessionId) {
        String url = openviduUrl + "/api/tokens";

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth("OPENVIDUAPP", openviduSecret);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String payload = "{ \"session\": \"" + sessionId + "\", \"role\": \"PUBLISHER\" }";

        HttpEntity<String> request = new HttpEntity<>(payload, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            try {
                return objectMapper.readTree(response.getBody()).get("token").asText();
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        } else {
            throw new RuntimeException("Failed to create OpenVidu connection");
        }
    }
}
