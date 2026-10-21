package com.sfa.backend.controller;

import com.sfa.backend.entity.Teacher;
import com.sfa.backend.repository.TeacherRepository;
import com.sfa.backend.security.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

@RestController @RequestMapping("/api/auth") @CrossOrigin(origins = "*")
public class AuthController {
    private final TeacherRepository teachers; private final PasswordEncoder encoder; private final JwtService jwt;
    public AuthController(TeacherRepository teachers, PasswordEncoder encoder, JwtService jwt) { this.teachers = teachers; this.encoder = encoder; this.jwt = jwt; }
    public record Registration(@NotBlank String name, @Email @NotBlank String email, @Size(min = 8) String password) { }
    public record Login(@Email @NotBlank String email, @NotBlank String password) { }
    @PostMapping("/register") @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> register(@Valid @RequestBody Registration request) {
        String email = request.email().trim().toLowerCase();
        if (teachers.existsByEmailIgnoreCase(email)) throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        Teacher teacher = teachers.save(new Teacher(request.name().trim(), email, encoder.encode(request.password())));
        return Map.of("token", jwt.createToken(email), "teacher", Map.of("id", teacher.getId(), "name", teacher.getName(), "email", teacher.getEmail()));
    }
    @PostMapping("/login")
    public Map<String, Object> login(@Valid @RequestBody Login request) {
        Teacher teacher = teachers.findByEmailIgnoreCase(request.email().trim()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        if (!encoder.matches(request.password(), teacher.getPasswordHash())) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        return Map.of("token", jwt.createToken(teacher.getEmail()), "teacher", Map.of("id", teacher.getId(), "name", teacher.getName(), "email", teacher.getEmail()));
    }
}
