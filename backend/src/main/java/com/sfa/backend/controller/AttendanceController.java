package com.sfa.backend.controller;

import com.sfa.backend.entity.*;
import com.sfa.backend.repository.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.*;
import java.util.*;

@RestController @RequestMapping("/api/attendance") @CrossOrigin(origins = "*")
public class AttendanceController {
    private final AttendanceSessionRepository sessions; private final AttendanceRecordRepository records; private final TimetableRepository timetables; private final StudentRepository students; private final TeacherRepository teachers;
    public AttendanceController(AttendanceSessionRepository s, AttendanceRecordRepository r, TimetableRepository t, StudentRepository st, TeacherRepository th) { sessions=s; records=r; timetables=t; students=st; teachers=th; }
    public record StartRequest(@NotNull Long timetableId, LocalDate sessionDate) { }
    public record MarkRequest(@NotNull Long studentId, String source) { }
    private Teacher teacher(Authentication a) { return teachers.findByEmailIgnoreCase(a.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED)); }
    private AttendanceSession session(Long id, Authentication a) { return sessions.findByIdAndTimetableTeacherId(id, teacher(a).getId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found")); }
    @GetMapping("/sessions") public List<AttendanceSession> listSessions(Authentication a) { return sessions.findByTimetableTeacherIdOrderByStartedAtDesc(teacher(a).getId()); }
    @PostMapping("/sessions") @ResponseStatus(HttpStatus.CREATED) public AttendanceSession start(@Valid @RequestBody StartRequest r, Authentication a) { Timetable t=timetables.findByIdAndTeacherId(r.timetableId(), teacher(a).getId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Timetable not found")); AttendanceSession s=new AttendanceSession(); s.setTimetable(t); s.setSessionDate(r.sessionDate()==null?LocalDate.now():r.sessionDate()); s.setStartedAt(Instant.now()); s.setStatus("OPEN"); return sessions.save(s); }
    @PostMapping("/sessions/{id}/close") public AttendanceSession close(@PathVariable Long id, Authentication a) { AttendanceSession s=session(id,a); s.setStatus("CLOSED"); s.setEndedAt(Instant.now()); return sessions.save(s); }
    @PostMapping("/sessions/{id}/records") @ResponseStatus(HttpStatus.CREATED) public AttendanceRecord mark(@PathVariable Long id, @Valid @RequestBody MarkRequest r, Authentication a) { AttendanceSession s=session(id,a); if (!"OPEN".equals(s.getStatus())) throw new ResponseStatusException(HttpStatus.CONFLICT,"Session is closed"); if (records.existsBySessionIdAndStudentId(id,r.studentId())) throw new ResponseStatusException(HttpStatus.CONFLICT,"Student already marked for this session"); Student st=students.findById(r.studentId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Student not found")); AttendanceRecord record=new AttendanceRecord(); record.setSession(s); record.setStudent(st); record.setMarkedAt(Instant.now()); record.setSource(r.source()==null?"MANUAL":r.source()); return records.save(record); }
    @GetMapping("/sessions/{id}/records") public List<AttendanceRecord> records(@PathVariable Long id, Authentication a) { session(id,a); return records.findAll().stream().filter(r -> r.getSession().getId().equals(id)).toList(); }
}
