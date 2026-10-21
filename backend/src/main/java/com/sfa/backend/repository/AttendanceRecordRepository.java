package com.sfa.backend.repository;

import com.sfa.backend.entity.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.*;

public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {
    boolean existsBySessionIdAndStudentId(Long sessionId, Long studentId);
    List<AttendanceRecord> findBySessionTimetableTeacherIdAndSessionSessionDateBetweenOrderByMarkedAtDesc(Long teacherId, LocalDate from, LocalDate to);
    @Query("select r from AttendanceRecord r where r.session.timetable.teacher.id = :teacherId and r.session.sessionDate between :from and :to and (:subject is null or lower(r.session.timetable.subject) = lower(:subject)) and (:course is null or lower(r.session.timetable.course) = lower(:course)) order by r.markedAt desc")
    List<AttendanceRecord> findReport(@Param("teacherId") Long teacherId, @Param("from") LocalDate from, @Param("to") LocalDate to, @Param("subject") String subject, @Param("course") String course);
    long countBySessionTimetableTeacherIdAndSessionSessionDate(Long teacherId, LocalDate date);
}
