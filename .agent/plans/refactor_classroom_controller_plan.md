# Implementation Plan - Refactor ClassroomController

The `ClassroomController` is currently performing direct SQL queries for creating and updating classrooms. This logic should be delegated to the `ClassroomRepository` to follow the project's architecture (Repository pattern).

## User Review Required

> [!IMPORTANT]
> This refactor assumes that the `ClassroomRepository` methods are correctly implemented and functional. I have verified they exist and look correct.

- **Gaps**: None identified.
- **Assumptions**: The repository pattern is the desired standard for this project.

## Proposed Changes

### Backend

#### [ClassroomController.js](/home/cima/Documentos/kindergarten_management/backend/controllers/ClassroomController.js)

- Refactor `createClassroom` to:
    - Prepare data with defaults (shift, academic_year).
    - Call `ClassroomRepository.create`.
    - Call `ClassroomRepository.assignTeacher` if `maestroId` is provided.
    - Fetch the result using `ClassroomRepository.getById`.
- Refactor `updateClassroom` to:
    - Call `ClassroomRepository.update`.
    - Call `ClassroomRepository.assignTeacher` if `maestroId` is defined.
    - Fetch the result using `ClassroomRepository.getById`.

## Verification Plan

### Automated Tests
- None available currently.

### Manual Verification
- Since I cannot run the frontend easily, I will rely on code correctness.
- I will verify the syntax and logic flow.
