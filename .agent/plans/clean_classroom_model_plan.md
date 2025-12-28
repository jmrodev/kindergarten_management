# Implementation Plan - Refactor Classroom Model

The objective is to strictly enforce the Repository Pattern by stripping the `Classroom` model of all direct database access logic. The model should act as a pure data structure/entity with domain validation rules.

## User Review Required

> [!IMPORTANT]
> This action removes `getAll`, `getById`, `create`, `update`, and `delete` methods from the `Classroom` class. Any code other than `ClassroomRepository` (or controllers incorrectly using the model directly) that relies on these static methods will break.
> **Assurance**: I have checked `ClassroomController` and it now uses `ClassroomRepository`.

- **Gaps**: Need to double-check if any other controllers/services import and use `Classroom.create`, `Classroom.getAll`, etc.
- **Assumptions**: `ClassroomRepository` is the sole designated data access point for Classrooms.

## Proposed Changes

### Backend

#### [Classroom.js](/home/cima/Documentos/kindergarten_management/backend/models/Classroom.js)

- Remove `require('../db')`.
- Remove `static async getAll`.
- Remove `static async getById`.
- Remove `static async create`.
- Remove `static async update`.
- Remove `static async delete`.
- Keep `constructor`, `isValid`, `fromDbRow`, `toDbRow`.

## Verification Plan

### Automated Tests
- None available.

### Manual Verification
- `grep` search for usages of `Classroom.getAll`, `Classroom.create`, etc. in the codebase to ensure nothing else is calling them.
- Verify `ClassroomController` remains error-free (it was recently refactored to use Repositories, so it should be fine).
