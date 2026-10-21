package com.sfa.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(name = "timetables")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Timetable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @NotBlank private String subject;
    @NotBlank private String course;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private DayOfWeek dayOfWeek;
    @Column(nullable = false) private LocalTime startTime;
    @Column(nullable = false) private LocalTime endTime;
    private String room;
    @JsonIgnore @ManyToOne(fetch = FetchType.LAZY, optional = false) private Teacher teacher;
    public Timetable() { }
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getSubject() { return subject; } public void setSubject(String v) { subject = v; }
    public String getCourse() { return course; } public void setCourse(String v) { course = v; }
    public DayOfWeek getDayOfWeek() { return dayOfWeek; } public void setDayOfWeek(DayOfWeek v) { dayOfWeek = v; }
    public LocalTime getStartTime() { return startTime; } public void setStartTime(LocalTime v) { startTime = v; }
    public LocalTime getEndTime() { return endTime; } public void setEndTime(LocalTime v) { endTime = v; }
    public String getRoom() { return room; } public void setRoom(String v) { room = v; }
    public Teacher getTeacher() { return teacher; } public void setTeacher(Teacher v) { teacher = v; }
}
