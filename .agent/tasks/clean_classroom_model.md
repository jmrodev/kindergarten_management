Clean up Classroom model to follow Repository Pattern

- [ ] Remove data access methods from `backend/models/Classroom.js` (getAll, getById, create, update, delete) <!-- id: 0 -->
- [ ] Ensure `backend/models/Classroom.js` focuses on class definition and domain validation (isValid, fromDbRow, toDbRow). <!-- id: 1 -->
- [ ] Verify `backend/repositories/ClassroomRepository.js` logic is robust (already partly done in previous step, but good to keep in mind). <!-- id: 2 -->
