# API and device integration

## Runtime secrets

Set `SFA_JWT_SECRET` to a random value of at least 32 characters and set `SFA_DEVICE_API_KEY` before deployment. The existing database configuration is unchanged; database credentials must be supplied and managed separately.

## Authentication

- `POST /api/auth/register` with `{ "name", "email", "password" }` (password minimum: 8 characters)
- `POST /api/auth/login` with `{ "email", "password" }`
- Send the returned JWT as `Authorization: Bearer <token>` to teacher endpoints.

The original `/api/students` CRUD remains compatible and is intentionally not forced behind teacher authentication during this phase.

## Teacher APIs

- `GET|POST|PUT|DELETE /api/timetables`
- `GET /api/attendance/sessions`
- `POST /api/attendance/sessions` with `timetableId` and optional `sessionDate`
- `POST /api/attendance/sessions/{id}/close`
- `POST /api/attendance/sessions/{id}/records` with `studentId` and optional `source`
- `GET /api/reports` and `GET /api/reports/csv`
- `GET /api/dashboard`

Teacher-owned resources are checked against the JWT subject. Attendance records are unique per session and student at both service and database levels.

## Fingerprint device event

`POST /api/device/events` is intended for a trusted ESP32 gateway. It requires:

```http
X-Device-Key: <SFA_DEVICE_API_KEY>
Content-Type: application/json
```

```json
{ "sessionId": 1, "studentId": 2, "fingerprintId": "template-17" }
```

The event is accepted only for an open session and is rejected if the student was already marked for that session. Fingerprint template matching, R307 communication, ESP32 firmware, and RTC wiring are **untested physical hardware integrations** in this phase.
