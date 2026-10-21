package com.sfa.backend.entity;

import jakarta.persistence.*;
import java.time.*;

@Entity
@Table(name = "attendance_sessions")
public class AttendanceSession {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) private Timetable timetable;
    @Column(nullable = false) private LocalDate sessionDate;
    @Column(nullable = false) private Instant startedAt;
    private Instant endedAt;
    @Column(nullable = false) private String status;
    public AttendanceSession() { }
    public Long getId() { return id; } public void setId(Long v) { id = v; }
    public Timetable getTimetable() { return timetable; } public void setTimetable(Timetable v) { timetable = v; }
    public LocalDate getSessionDate() { return sessionDate; } public void setSessionDate(LocalDate v) { sessionDate = v; }
    public Instant getStartedAt() { return startedAt; } public void setStartedAt(Instant v) { startedAt = v; }
    public Instant getEndedAt() { return endedAt; } public void setEndedAt(Instant v) { endedAt = v; }
    public String getStatus() { return status; } public void setStatus(String v) { status = v; }
}
