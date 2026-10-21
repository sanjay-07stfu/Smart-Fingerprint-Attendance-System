package com.sfa.backend.repository;

import com.sfa.backend.entity.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TimetableRepository extends JpaRepository<Timetable, Long> {
    List<Timetable> findByTeacherIdOrderByDayOfWeekAscStartTimeAsc(Long teacherId);
    java.util.Optional<Timetable> findByIdAndTeacherId(Long id, Long teacherId);
}
