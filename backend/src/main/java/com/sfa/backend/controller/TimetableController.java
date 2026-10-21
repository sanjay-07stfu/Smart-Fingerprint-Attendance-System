package com.sfa.backend.controller;

import com.sfa.backend.entity.*;
import com.sfa.backend.repository.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.*;
import java.util.List;

@RestController @RequestMapping("/api/timetables") @CrossOrigin(origins = "*")
public class TimetableController {
    private final TimetableRepository timetables; private final TeacherRepository teachers;
    public TimetableController(TimetableRepository timetables, TeacherRepository teachers) { this.timetables = timetables; this.teachers = teachers; }
    public record Request(@NotBlank String subject, @NotBlank String course, DayOfWeek dayOfWeek, LocalTime startTime, LocalTime endTime, String room) { }
    private Teacher teacher(Authentication auth) { return teachers.findByEmailIgnoreCase(auth.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED)); }
    private void copy(Request r, Timetable t) { t.setSubject(r.subject().trim()); t.setCourse(r.course().trim()); t.setDayOfWeek(r.dayOfWeek()); t.setStartTime(r.startTime()); t.setEndTime(r.endTime()); t.setRoom(r.room()); if (r.dayOfWeek() == null || r.startTime() == null || r.endTime() == null || !r.endTime().isAfter(r.startTime())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Valid day and time range are required"); }
    @GetMapping public List<Timetable> list(Authentication auth) { return timetables.findByTeacherIdOrderByDayOfWeekAscStartTimeAsc(teacher(auth).getId()); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public Timetable create(@Valid @RequestBody Request r, Authentication auth) { Timetable t = new Timetable(); copy(r, t); t.setTeacher(teacher(auth)); return timetables.save(t); }
    @PutMapping("/{id}") public Timetable update(@PathVariable Long id, @Valid @RequestBody Request r, Authentication auth) { Timetable t = timetables.findByIdAndTeacherId(id, teacher(auth).getId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)); copy(r, t); return timetables.save(t); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id, Authentication auth) { Timetable t = timetables.findByIdAndTeacherId(id, teacher(auth).getId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)); timetables.delete(t); }
}
