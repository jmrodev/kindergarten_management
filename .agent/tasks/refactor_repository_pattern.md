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

- [x] Create `ActivityRepository.js` and migrate logic from `Activity.js`. <!-- id: 8 -->
- [x] Refactor `ActivityController` (partially done). <!-- id: 9 -->
- [x] Clean `Activity.js`. <!-- id: 10 -->
- [x] Create `AttendanceRepository.js` and migrate logic from `Attendance.js`. <!-- id: 11 -->
- [x] Refactor `AttendanceController` (partially done). <!-- id: 12 -->
- [x] Clean `Attendance.js`. <!-- id: 13 -->
- [x] Create `CalendarRepository.js` and migrate logic from `Calendar.js`. <!-- id: 14 -->
- [x] Refactor `CalendarController` (partially done). <!-- id: 15 -->
- [x] Clean `Calendar.js`. <!-- id: 16 -->

# Phase 4: Remaining Models (DocumentReview, Vaccination, Address, etc.)

- [x] Refactor `DocumentReview` (Repository created, Controller updated, Model cleaned). <!-- id: 17 -->
- [x] Refactor `VaccinationRecord` (Repository created, Controller updated, Model cleaned). <!-- id: 18 -->
- [x] Refactor `Address` (Repository created, Model cleaned). <!-- id: 19 -->
- [x] Refactor `EmergencyContact` (Repository created, Model cleaned). <!-- id: 20 -->
- [x] Refactor `MeetingMinutes` (Repository verified, Controller updated, Model cleaned). <!-- id: 21 -->
- [x] Refactor `AccessLevel` (Model cleaned, logic in RoleRepository). <!-- id: 22 -->
- [x] Verify `Classroom`, `HealthInsurance`, `Pediatrician` (Already using Repositories). <!-- id: 23 -->

# Phase 5: Controller Cleanup (Remove direct SQL)

- [ ] Refactor `EnrollmentController.js` to use Repositories with transactions. <!-- id: 24 -->
- [ ] Refactor `dashboardController.js` to separate stats logic into Repositories. <!-- id: 25 -->
