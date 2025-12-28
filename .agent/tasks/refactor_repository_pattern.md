Refactor Project to Repository Pattern

# Phase 1: Core Models (Student, Staff)

- [x] Move any missing methods from `Student.js` to `StudentRepository.js` (`getVaccinationStatus`, `getPendingDocuments`). <!-- id: 0 -->
- [x] Refactor `StudentController` and other consumers to use `StudentRepository`. <!-- id: 1 -->
- [x] Clean `Student.js` model (remove DB access). <!-- id: 2 -->
- [x] Ensure `StaffRepository.js` handles BigInt conversion (ported from `Staff.js`). <!-- id: 3 -->
- [x] Refactor `StaffController` and consumers (`AuthController`, etc.) to use `StaffRepository`. <!-- id: 4 -->
- [x] Clean `Staff.js` model. <!-- id: 5 -->

# Phase 2: Secondary Models (Guardian, Role, etc.)

- [x] Check `Guardian.js` vs `GuardianRepository.js` and refactor. <!-- id: 6 -->
- [x] Check `Role.js` vs `RoleRepository.js` and refactor. <!-- id: 7 -->

# Phase 3: Models without Repositories (Activity, Attendance, Calendar)

- [ ] Create `ActivityRepository.js` and migrate logic from `Activity.js`. <!-- id: 8 -->
- [ ] Refactor `ActivityController` (partially done). <!-- id: 9 -->
- [ ] Clean `Activity.js`. <!-- id: 10 -->
- [ ] Create `AttendanceRepository.js` and migrate logic from `Attendance.js`. <!-- id: 11 -->
- [ ] Refactor `AttendanceController` (partially done). <!-- id: 12 -->
- [ ] Clean `Attendance.js`. <!-- id: 13 -->
- [ ] Create `CalendarRepository.js` and migrate logic from `Calendar.js`. <!-- id: 14 -->
- [ ] Refactor `CalendarController` (partially done). <!-- id: 15 -->
- [ ] Clean `Calendar.js`. <!-- id: 16 -->
