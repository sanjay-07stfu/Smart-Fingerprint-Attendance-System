package com.sfa.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {
    private final SecretKey key;
    private final long expirationMs;
    public JwtService(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.expiration-ms}") long expirationMs) {
        this.key = secret.isBlank()
                ? Keys.secretKeyFor(SignatureAlgorithm.HS256)
                : createKey(secret);
        this.expirationMs = expirationMs;
    }

    private SecretKey createKey(String secret) {
        if (secret.length() < 32) throw new IllegalArgumentException("app.jwt.secret must be at least 32 characters");
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
    public String createToken(String email) {
        Date now = new Date();
        return Jwts.builder().subject(email).issuedAt(now).expiration(new Date(now.getTime() + expirationMs)).signWith(key).compact();
    }
    public String subject(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();
    }
}
