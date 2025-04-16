package com.h5.session.service;

public interface OpenViduService {
    String createSession();

//    String createToken(String sessionId);

    String createConnection(String sessionId);
}
