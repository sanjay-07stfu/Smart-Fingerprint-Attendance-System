package com.sfa.backend.repository;

import com.sfa.backend.entity.AttendanceSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.*;

public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession, Long> {
    List<AttendanceSession> findByTimetableTeacherIdOrderByStartedAtDesc(Long teacherId);
    Optional<AttendanceSession> findByIdAndTimetableTeacherId(Long id, Long teacherId);
    long countByTimetableTeacherIdAndSessionDate(Long teacherId, LocalDate date);
}
