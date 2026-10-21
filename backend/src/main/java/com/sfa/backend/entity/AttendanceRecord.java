package com.sfa.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "attendance_records", uniqueConstraints = @UniqueConstraint(columnNames = {"session_id", "student_id"}))
public class AttendanceRecord {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional = false) private AttendanceSession session;
    @ManyToOne(optional = false) private Student student;
    @Column(nullable = false) private Instant markedAt;
    @Column(nullable = false) private String source;
    public AttendanceRecord() { }
    public Long getId() { return id; } public void setId(Long v) { id = v; }
    public AttendanceSession getSession() { return session; } public void setSession(AttendanceSession v) { session = v; }
    public Student getStudent() { return student; } public void setStudent(Student v) { student = v; }
    public Instant getMarkedAt() { return markedAt; } public void setMarkedAt(Instant v) { markedAt = v; }
    public String getSource() { return source; } public void setSource(String v) { source = v; }
}
