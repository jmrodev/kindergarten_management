-- Migration: Add DNI field to staff table
-- Date: 2025-11-27
-- Description: Adds DNI (national ID) field to staff table for authentication

ALTER TABLE staff 
ADD COLUMN IF NOT EXISTS dni VARCHAR(20) UNIQUE AFTER maternal_surname;

-- Note: When creating a new staff member, the DNI will be used as the initial password
-- Staff members can change their password after first login using the change-password endpoint
