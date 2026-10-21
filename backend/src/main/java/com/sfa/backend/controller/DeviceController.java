package com.sfa.backend.controller;

import com.sfa.backend.entity.*;
import com.sfa.backend.repository.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

@RestController @RequestMapping("/api/device") @CrossOrigin(origins = "*")
public class DeviceController {
    private final AttendanceSessionRepository sessions; private final AttendanceRecordRepository records; private final StudentRepository students; private final String apiKey;
    public DeviceController(AttendanceSessionRepository s, AttendanceRecordRepository r, StudentRepository st, @Value("${app.device.api-key}") String apiKey) { sessions=s;records=r;students=st;this.apiKey=apiKey; }
    public record Event(@NotNull Long sessionId, @NotNull Long studentId, @NotBlank String fingerprintId) { }
    @PostMapping("/events") @ResponseStatus(HttpStatus.CREATED) public Map<String,Object> event(@RequestHeader(value="X-Device-Key",required=false) String supplied, @Valid @RequestBody Event e) { if (apiKey.isBlank() || supplied==null || !java.security.MessageDigest.isEqual(apiKey.getBytes(), supplied.getBytes())) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid device key"); AttendanceSession s=sessions.findById(e.sessionId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Session not found")); if (!"OPEN".equals(s.getStatus())) throw new ResponseStatusException(HttpStatus.CONFLICT,"Session is closed"); if (records.existsBySessionIdAndStudentId(e.sessionId(),e.studentId())) throw new ResponseStatusException(HttpStatus.CONFLICT,"Duplicate attendance event"); var student=students.findById(e.studentId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Student not found")); if (student.getFingerprintId()==null || !student.getFingerprintId().equals(e.fingerprintId())) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Fingerprint is not mapped to this student"); AttendanceRecord r=new AttendanceRecord(); r.setSession(s); r.setStudent(student); r.setMarkedAt(java.time.Instant.now()); r.setSource("FINGERPRINT"); records.save(r); return Map.of("accepted",true,"recordId",r.getId()); }
}
