package com.sfa.backend.controller;

import com.sfa.backend.entity.AttendanceRecord;
import com.sfa.backend.repository.*;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.nio.charset.StandardCharsets;
import java.time.*;
import java.util.*;

@RestController @RequestMapping("/api/reports") @CrossOrigin(origins = "*")
public class ReportController {
    private final AttendanceRecordRepository records; private final TeacherRepository teachers;
    public ReportController(AttendanceRecordRepository records, TeacherRepository teachers) { this.records=records; this.teachers=teachers; }
    @GetMapping public List<AttendanceRecord> report(@RequestParam(required=false) LocalDate from, @RequestParam(required=false) LocalDate to, @RequestParam(required=false) String subject, @RequestParam(required=false) String course, Authentication a) { LocalDate end=to==null?LocalDate.now():to; return records.findReport(teachers.findByEmailIgnoreCase(a.getName()).orElseThrow().getId(), from==null?end.minusDays(30):from, end, blankAsNull(subject), blankAsNull(course)); }
    @GetMapping(value="/csv", produces="text/csv") public ResponseEntity<byte[]> csv(@RequestParam(required=false) LocalDate from, @RequestParam(required=false) LocalDate to, @RequestParam(required=false) String subject, @RequestParam(required=false) String course, Authentication a) { StringBuilder csv=new StringBuilder("date,subject,course,studentId,studentName,source,markedAt\n"); for (AttendanceRecord r:report(from,to,subject,course,a)) csv.append(r.getSession().getSessionDate()).append(',').append(escape(r.getSession().getTimetable().getSubject())).append(',').append(escape(r.getSession().getTimetable().getCourse())).append(',').append(r.getStudent().getId()).append(',').append(escape(r.getStudent().getName())).append(',').append(r.getSource()).append(',').append(r.getMarkedAt()).append('\n'); return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=attendance-report.csv").contentType(MediaType.parseMediaType("text/csv")).body(csv.toString().getBytes(StandardCharsets.UTF_8)); }
    private String blankAsNull(String value) { return value == null || value.isBlank() ? null : value.trim(); }
    private String escape(String value) { return "\""+value.replace("\"","\"\"")+"\""; }
}
