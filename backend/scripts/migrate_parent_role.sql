-- 1. Create 'Parent' role if it doesn't exist (using Tutor's access level for now or a new one)
-- Assuming @guardian_access_level_id exists or we look it up.
-- We'll do it safely with subqueries.

SET @guardian_access_level_id = (SELECT id FROM access_level WHERE access_name = 'Guardian Access' LIMIT 1);

-- If Guardian Access doesn't exist, create it (safety check)
INSERT INTO access_level (access_name, description)
SELECT 'Guardian Access', 'Grants privileges for parents/guardians.'
WHERE NOT EXISTS (SELECT 1 FROM access_level WHERE access_name = 'Guardian Access');

SET @guardian_access_level_id = (SELECT id FROM access_level WHERE access_name = 'Guardian Access' LIMIT 1);

-- Insert Parent Role
INSERT INTO role (role_name, access_level_id)
SELECT 'Parent', @guardian_access_level_id
WHERE NOT EXISTS (SELECT 1 FROM role WHERE role_name = 'Parent');

SET @parent_role_id = (SELECT id FROM role WHERE role_name = 'Parent' LIMIT 1);

-- 2. Add role_id to parent_portal_users
-- Check if column exists first? MariaDB doesn't have IF NOT EXISTS for columns easily in older versions, 
-- but we can just use a harmless ALTER or ignore error if strict mode off. 
-- Better: try-catch logic isn't available in standard SQL script without procedure.
-- We will assume the column needs to be allowed NULL initially.

ALTER TABLE parent_portal_users ADD COLUMN role_id INT;
ALTER TABLE parent_portal_users ADD CONSTRAINT fk_ppu_role FOREIGN KEY (role_id) REFERENCES role(id);

-- 3. Update existing users to have the Parent role
UPDATE parent_portal_users SET role_id = @parent_role_id WHERE role_id IS NULL;

-- 4. Grant Permissions to Parent Role
-- Give 'ver' on 'my-children' (conceptually, though permissions are by module)
-- We'll give: 
-- alumnos: ver, crear (to register)
-- responsables: ver, crear
-- matriculacion: ver (if exists)

-- Get Module IDs
SET @mod_alumnos = (SELECT id FROM system_module WHERE module_key = 'alumnos' LIMIT 1);
SET @mod_responsables = (SELECT id FROM system_module WHERE module_key = 'responsables' LIMIT 1);
-- SET @mod_dashboard = (SELECT id FROM system_module WHERE module_key = 'dashboard' LIMIT 1); -- Maybe?

-- Get Action IDs
SET @act_ver = (SELECT id FROM permission_action WHERE action_key = 'ver' LIMIT 1);
SET @act_crear = (SELECT id FROM permission_action WHERE action_key = 'crear' LIMIT 1);
SET @act_editar = (SELECT id FROM permission_action WHERE action_key = 'editar' LIMIT 1);

-- Grant Alumnos: Ver, Crear
INSERT INTO role_permission (role_id, module_id, action_id, is_granted)
SELECT @parent_role_id, @mod_alumnos, @act_ver, 1
WHERE NOT EXISTS (SELECT 1 FROM role_permission WHERE role_id = @parent_role_id AND module_id = @mod_alumnos AND action_id = @act_ver);

INSERT INTO role_permission (role_id, module_id, action_id, is_granted)
SELECT @parent_role_id, @mod_alumnos, @act_crear, 1
WHERE NOT EXISTS (SELECT 1 FROM role_permission WHERE role_id = @parent_role_id AND module_id = @mod_alumnos AND action_id = @act_crear);
