
/* Legacy draft retained for reference; the active entry is AuthenticatedApp.jsx.
import { useEffect, useMemo, useState } from "react";
import "./index.css";

const API_URL = "http://localhost:8080/api/students";

const navigation = [
  { id: "Dashboard", icon: "▦" },
  { id: "Students", icon: "♙" },
  { id: "Attendance", icon: "▣" },
  { id: "Timetable", icon: "◷" },
  { id: "Reports", icon: "▤" },
  { id: "Settings", icon: "⚙" },
];

function Icon({ children }) {
  return <span className="nav-icon" aria-hidden="true">{children}</span>;
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [showStudentForm, setShowStudentForm] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [studentForm, setStudentForm] = useState({ name: "", email: "", course: "" });
    const [formError, setFormError] = useState("");
    const [actionMessage, setActionMessage] = useState("");
    const [savingStudent, setSavingStudent] = useState(false);
    const [deletingStudentId, setDeletingStudentId] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("sfa-token") || "");
    const [teacher, setTeacher] = useState(() => JSON.parse(localStorage.getItem("sfa-teacher") || "null"));
    const [loggedIn, setLoggedIn] = useState(Boolean(token));
    const [attendanceStudent, setAttendanceStudent] = useState("");
    const [scheduleForm, setScheduleForm] = useState({ subject: "", course: "", dayOfWeek: "MONDAY", startTime: "09:00", endTime: "10:00", room: "" });
    const [message, setMessage] = useState("");
    const [stats, setStats] = useState({});
    const [report, setReport] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [timetables, setTimetables] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [navigation, setNavigation] = useState(["Dashboard", "Students", "Attendance", "Timetable", "Reports", "Settings"]);
    const API = "http://localhost:8080/api";
    
    async function request(path, options = {}, token = "") {
      const response = await fetch(`${API}${path}`, {
        ...options,
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) },
      });
      if (!response.ok) { const problem = await response.json().catch(() => null); throw new Error(problem?.message || `Server returned ${response.status}`); }
      return response.status === 204 ? null : response.json();
    }
    
    async function loadStudents() {
      try {
        setStudents(await request("/students"));
      } catch (e) {
        setError(e.message);
      }
    }
    
    useEffect(() => {
      loadStudents();
    }, []);
    
    function authenticated(data) {
      setToken(data.token);
      setTeacher(data.teacher);
      setLoggedIn(true);
    }
    
    if (!loggedIn) return <Login onAuthenticated={authenticated} />;
    
    function Students() {
      return <section className="panel page-panel"><div className="panel-heading"><div><h3>Student management</h3><p>Student records remain available through the original CRUD API.</p></div><button className="button button-primary" onClick={() => setStudentForm({ name: "", email: "", course: "" })}>＋ Add student</button></div><form className="student-form" onSubmit={saveStudent}><div className="form-grid"><input placeholder="Name" required value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} /><input type="email" placeholder="Email" required value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} /><input placeholder="Course" required value={studentForm.course} onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })} /></div><button className="button button-primary">{editingStudent ? "Save changes" : "Add student"}</button></form><input className="wide-input" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} /><div className="table-scroll"><table><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Course</th><th>Actions</th></tr></thead><tbody>{filteredStudents.map((s) => <tr key={s.id}><td>#{s.id}</td><td>{s.name}</td><td>{s.email}</td><td>{s.course}</td><td><button className="button button-small button-secondary" onClick={() => { setEditingStudent(s); setStudentForm(s); }}>Edit</button> <button className="button button-small button-danger" onClick={() => removeStudent(s.id)}>Delete</button></td></tr>)}</tbody></table></div></section>; }
    
    return <div className="app-shell"><aside className="sidebar"><div className="brand"><div className="brand-mark">◎</div><div><h1>SmartAttend</h1><p>Fingerprint attendance</p></div></div><div className="sidebar-label">WORKSPACE</div><nav className="sidebar-nav">{navigation.map((page) => <button className={`nav-item ${activePage === page ? "active" : ""}`} key={page} onClick={() => { setActivePage(page); setError(""); }}>{page}</button>)}</nav><div className="sidebar-bottom"><div className="device-card"><strong>Hardware untested</strong><p>Configure the device key before connecting ESP32.</p></div></div></aside><main className="main-area"><header className="topbar"><div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>{activePage}</strong></div><div className="teacher-profile"><div className="teacher-avatar">{(teacher?.name || "T")[0]}</div><div><strong>{teacher?.name}</strong><span>Teacher</span></div></div></header><div className="page-content">{error && <div className="alert alert-error">{error}</div>}{message && <div className="alert alert-success">{message}</div>}<Page /></div></main></div>;
}

export default App;
*/
  const [search, setSearch] = useState("");
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({ name: "", email: "", course: "" });
  const [formError, setFormError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [savingStudent, setSavingStudent] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState(null);

  async function loadStudents() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected response from the student API");
      }

      setStudents(data);
    } catch {
      setError(
        "Unable to load students. Check that your Spring Boot backend is running on port 8080."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // The initial request synchronizes the component with the backend.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStudents();
  }, []);

  function startAddingStudent() {
    setEditingStudent(null);
    setShowStudentForm(true);
    setStudentForm({ name: "", email: "", course: "" });
    setFormError("");
    setActionMessage("");
  }

  function startEditingStudent(student) {
    setActivePage("Students");
    setEditingStudent(student);
    setShowStudentForm(true);
    setStudentForm({
      name: student.name || "",
      email: student.email || "",
      course: student.course || "",
    });
    setFormError("");
    setActionMessage("");
  }

  function cancelStudentForm() {
    setEditingStudent(null);
    setShowStudentForm(false);
    setStudentForm({ name: "", email: "", course: "" });
    setFormError("");
  }

  function updateStudentField(event) {
    const { name, value } = event.target;
    setStudentForm((current) => ({ ...current, [name]: value }));
  }

  async function saveStudent(event) {
    event.preventDefault();
    setFormError("");
    setActionMessage("");

    const name = studentForm.name.trim();
    const email = studentForm.email.trim();
    const course = studentForm.course.trim();

    if (!name || !email || !course) {
      setFormError("Name, email, and course are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Enter a valid email address.");
      return;
    }

    setSavingStudent(true);

    try {
      const isEditing = Boolean(editingStudent);
      const response = await fetch(
        isEditing ? `${API_URL}/${editingStudent.id}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, course }),
        }
      );

      if (!response.ok) {
        const problem = await response.json().catch(() => null);
        throw new Error(problem?.message || `Server returned ${response.status}`);
      }

      await loadStudents();
      setActionMessage(isEditing ? "Student updated successfully." : "Student added successfully.");
      cancelStudentForm();
    } catch (err) {
      setFormError(err.message || "Unable to save the student.");
    } finally {
      setSavingStudent(false);
    }
  }

  async function deleteStudent(student) {
    if (!window.confirm(`Delete ${student.name || "this student"}? This cannot be undone.`)) return;

    setDeletingStudentId(student.id);
    setActionMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/${student.id}`, { method: "DELETE" });

      if (!response.ok) {
        const problem = await response.json().catch(() => null);
        throw new Error(problem?.message || `Server returned ${response.status}`);
      }

      await loadStudents();
      setActionMessage("Student deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete the student.");
    } finally {
      setDeletingStudentId(null);
    }
  }

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return students;

    return students.filter((student) =>
      [
        student.id,
        student.name,
        student.email,
        student.course,
        student.division,
        student.batch,
      ].some((value) => String(value ?? "").toLowerCase().includes(query))
    );
  }, [students, search]);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function renderStudentsTable() {
    return (
      <>
        {error && (
          <div className="alert alert-error">
            <span>!</span>
            <div>
              <strong>Backend connection issue</strong>
              <p>{error}</p>
              <button className="button button-secondary" onClick={loadStudents}>
                Try again
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="empty-state">
            <div className="spinner" />
            <p>Loading students from your database...</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td><span className="id-chip">#{student.id}</span></td>
                    <td>
                      <div className="student-cell">
                        <span className="avatar">
                          {(student.name || "S").charAt(0).toUpperCase()}
                        </span>
                        <strong>{student.name || "Unnamed student"}</strong>
                      </div>
                    </td>
                    <td>{student.email || "—"}</td>
                    <td>{student.course || "—"}</td>
                    <td>
                      <div className="table-actions">
                        <button className="button button-small button-secondary" onClick={() => startEditingStudent(student)}>
                          Edit
                        </button>
                        <button
                          className="button button-small button-danger"
                          onClick={() => deleteStudent(student)}
                          disabled={deletingStudentId === student.id}
                        >
                          {deletingStudentId === student.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="5" className="table-empty">
                      {students.length === 0
                        ? "No students found. Add a student using your API."
                        : "No students match your search."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="table-footer">
          <span>
            Showing {filteredStudents.length} of {students.length} registered students
          </span>
          <button className="button button-secondary" onClick={loadStudents}>
            ↻ Refresh
          </button>
        </div>
      </>
    );
  }

  function renderDashboard() {
    return (
      <>
        <section className="welcome-banner">
          <div className="welcome-copy">
            <span className="eyebrow">TEACHER WORKSPACE</span>
            <h2>Welcome back, Teacher! <span>✦</span></h2>
            <p>Manage your students, lectures and attendance in one place.</p>
            <div className="welcome-date">◷ &nbsp; {today}</div>
          </div>
          <div className="fingerprint-art" aria-hidden="true">
            <span>◎</span>
            <small>SECURE · SMART · RELIABLE</small>
          </div>
        </section>

        <section className="stats-grid">
          <article className="stat-card stat-blue">
            <div className="stat-top">
              <span className="stat-icon">♙</span>
              <span className="stat-label">STUDENT RECORDS</span>
            </div>
            <h3>{loading ? "—" : students.length}</h3>
            <p>Registered in the database</p>
            <span className="stat-foot">↗ Live API data</span>
          </article>

          <article className="stat-card stat-green">
            <div className="stat-top">
              <span className="stat-icon">▣</span>
              <span className="stat-label">TODAY'S ATTENDANCE</span>
            </div>
            <h3>—</h3>
            <p>Not connected to attendance records</p>
            <span className="stat-foot">Integration pending</span>
          </article>

          <article className="stat-card stat-purple">
            <div className="stat-top">
              <span className="stat-icon">◷</span>
              <span className="stat-label">ACTIVE SESSION</span>
            </div>
            <h3 className="stat-word">No active session</h3>
            <p>Timetable integration pending</p>
            <span className="stat-foot">Session not started</span>
          </article>

          <article className="stat-card stat-orange">
            <div className="stat-top">
              <span className="stat-icon">◎</span>
              <span className="stat-label">FINGERPRINT DEVICE</span>
            </div>
            <h3 className="stat-word">Not connected</h3>
            <p>ESP32 / R307 hardware</p>
            <span className="stat-foot"><span className="status-dot dot-gray" /> Awaiting setup</span>
          </article>
        </section>

        <section className="content-grid">
          <article className="panel overview-panel">
            <div className="panel-heading">
              <div>
                <h3>Attendance overview</h3>
                <p>Attendance activity will appear here</p>
              </div>
              <span className="panel-icon">▥</span>
            </div>
            <div className="chart-placeholder">
              <div className="chart-grid-lines">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>
              <div className="chart-empty">
                <span className="chart-empty-icon">▥</span>
                <strong>No attendance data yet</strong>
                <p>Connect attendance APIs to show daily trends.</p>
              </div>
            </div>
            <div className="chart-legend">
              <span><i className="legend-dot blue-dot" /> Present</span>
              <span><i className="legend-dot gray-dot" /> Absent</span>
            </div>
          </article>

          <article className="panel division-panel">
            <div className="panel-heading">
              <div>
                <h3>Students by division</h3>
                <p>Division data from student records</p>
              </div>
              <span className="panel-icon">♧</span>
            </div>
            <div className="division-empty">
              <div className="donut"><span>—<small>students</small></span></div>
              <div>
                <strong>Division breakdown</strong>
                <p>We'll enable this chart after adding batch and division fields to the student model.</p>
              </div>
            </div>
          </article>
        </section>

        <section className="panel recent-panel">
          <div className="panel-heading">
            <div>
              <h3>Registered students</h3>
              <p>Live records retrieved from your Spring Boot API</p>
            </div>
            <button className="button button-primary" onClick={() => setActivePage("Students")}>
              View students →
            </button>
          </div>
          {renderStudentsTable()}
        </section>
      </>
    );
  }

  function renderPage() {
    if (activePage === "Dashboard") return renderDashboard();

    if (activePage === "Students") {
      return (
        <section className="panel page-panel">
          <div className="panel-heading">
            <div>
              <h3>Student management</h3>
              <p>View the students stored in your MySQL database.</p>
            </div>
            <div className="panel-actions">
              <button className="button button-secondary" onClick={loadStudents}>↻ Refresh data</button>
              <button className="button button-primary" onClick={startAddingStudent}>＋ Add student</button>
            </div>
          </div>
          {(formError || actionMessage) && (
            <div className={`alert ${formError ? "alert-error" : "alert-success"}`}>
              <span>{formError ? "!" : "✓"}</span>
              <p>{formError || actionMessage}</p>
            </div>
          )}
          {showStudentForm && (
            <form className="student-form" onSubmit={saveStudent}>
              <div className="form-heading">
                <div>
                  <h4>{editingStudent ? "Edit student" : "Add student"}</h4>
                  <p>Required fields are marked with an asterisk.</p>
                </div>
                <button type="button" className="button button-secondary" onClick={cancelStudentForm}>Cancel</button>
              </div>
              <div className="form-grid">
                <label>Name *<input name="name" value={studentForm.name} onChange={updateStudentField} required /></label>
                <label>Email *<input type="email" name="email" value={studentForm.email} onChange={updateStudentField} required /></label>
                <label>Course *<input name="course" value={studentForm.course} onChange={updateStudentField} required /></label>
              </div>
              <button className="button button-primary" type="submit" disabled={savingStudent}>
                {savingStudent ? "Saving..." : editingStudent ? "Save changes" : "Add student"}
              </button>
            </form>
          )}
          <div className="search-row">
            <input
              aria-label="Search students"
              placeholder="Search by name, email, course or ID..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <span className="result-count">{filteredStudents.length} results</span>
          </div>
          {renderStudentsTable()}
          <div className="info-note">
            <strong>Next enhancement:</strong> student registration, editing, batch/division assignment and fingerprint enrollment.
          </div>
        </section>
      );
    }

    const pageInfo = {
      Attendance: {
        icon: "▣",
        title: "Attendance management",
        description: "Manage lecture sessions and verify student attendance.",
        items: [
          ["Attendance sessions", "Create and close a lecture attendance session."],
          ["Fingerprint verification", "Match R307 template IDs to registered students."],
          ["Batch and division checks", "Only eligible students can be marked present."],
          ["Duplicate prevention", "Prevent repeated attendance for the same session."],
        ],
      },
      Timetable: {
        icon: "◷",
        title: "Lecture timetable",
        description: "Schedule lectures and identify the current class using RTC time.",
        items: [
          ["Lecture schedule", "Subject, teacher, date and lecture time."],
          ["Batch and division", "Choose the division eligible for each lecture."],
          ["DS3231 integration", "Read device time and compare it against the timetable."],
          ["Session controls", "Start and end the attendance window."],
        ],
      },
      Reports: {
        icon: "▤",
        title: "Attendance reports",
        description: "Prepare accurate attendance summaries after the attendance APIs are implemented.",
        items: [
          ["Daily report", "Review attendance for a selected date."],
          ["Student report", "Review an individual student's attendance history."],
          ["Division and subject", "Filter records by class, division and subject."],
          ["Export options", "PDF, Excel and CSV exports are planned."],
        ],
      },
      Settings: {
        icon: "⚙",
        title: "System settings",
        description: "Configure the attendance system and review integration requirements.",
        items: [
          ["Backend", "Spring Boot API at localhost:8080"],
          ["Database", "MySQL database: smart_fingerprint_attendance"],
          ["Fingerprint sensor", "R307 sensor — hardware integration pending"],
          ["ESP32 and RTC", "Wi-Fi, UART and I²C setup pending"],
        ],
      },
    };

    const page = pageInfo[activePage];

    return (
      <section className="page-panel">
        <div className="section-intro">
          <span className="section-icon">{page.icon}</span>
          <div>
            <h2>{page.title}</h2>
            <p>{page.description}</p>
          </div>
        </div>
        <div className="feature-grid">
          {page.items.map(([title, description], index) => (
            <article className="feature-card" key={title}>
              <span className="feature-number">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="coming-soon">◷ &nbsp; Integration pending</span>
            </article>
          ))}
        </div>
        {activePage === "Reports" && (
          <div className="info-note">
            Export buttons will be enabled when real attendance records are available.
          </div>
        )}
      </section>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">◎</div>
          <div>
            <h1>SmartAttend</h1>
            <p>Fingerprint attendance</p>
          </div>
        </div>

        <div className="sidebar-label">WORKSPACE</div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => setActivePage(item.id)}
            >
              <Icon>{item.icon}</Icon>
              <span>{item.id}</span>
              {item.id === "Students" && students.length > 0 && (
                <span className="nav-count">{students.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="device-card">
            <div className="device-card-top">
              <span className="status-dot dot-gray" />
              <strong>Hardware offline</strong>
            </div>
            <p>Connect ESP32 to enable fingerprint attendance.</p>
          </div>
          <div className="sidebar-version">SMARTATTEND · VERSION 1.0</div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>Workspace</span><span className="crumb-divider">/</span><strong>{activePage}</strong>
          </div>
          <div className="topbar-right">
            <label className="top-search">
              <span>⌕</span>
              <input
                placeholder="Search students..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  if (event.target.value) setActivePage("Students");
                }}
                aria-label="Search students"
              />
              <kbd>⌕</kbd>
            </label>
            <div className="teacher-profile">
              <div className="teacher-avatar">T</div>
              <div><strong>Teacher</strong><span>Administrator</span></div>
            </div>
          </div>
        </header>

        <div className="page-content">
          {renderPage()}
          <footer className="app-footer">
            <span>© {new Date().getFullYear()} Smart Fingerprint Attendance System</span>
            <span>React <b>·</b> Spring Boot <b>·</b> MySQL</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
