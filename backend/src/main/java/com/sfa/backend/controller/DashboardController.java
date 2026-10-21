package com.sfa.backend.controller;

import com.sfa.backend.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Map;

@RestController @RequestMapping("/api/dashboard") @CrossOrigin(origins = "*")
public class DashboardController {
    private final StudentRepository students; private final TimetableRepository timetables; private final AttendanceSessionRepository sessions; private final AttendanceRecordRepository records; private final TeacherRepository teachers;
    public DashboardController(StudentRepository s, TimetableRepository t, AttendanceSessionRepository se, AttendanceRecordRepository r, TeacherRepository th) { students=s;timetables=t;sessions=se;records=r;teachers=th; }
    @GetMapping public Map<String, Object> stats(Authentication a) { Long id=teachers.findByEmailIgnoreCase(a.getName()).orElseThrow().getId(); LocalDate today=LocalDate.now(); return Map.of("students",students.count(),"timetables",timetables.findByTeacherIdOrderByDayOfWeekAscStartTimeAsc(id).size(),"sessionsToday",sessions.countByTimetableTeacherIdAndSessionDate(id,today),"presentToday",records.countBySessionTimetableTeacherIdAndSessionSessionDate(id,today)); }
}
