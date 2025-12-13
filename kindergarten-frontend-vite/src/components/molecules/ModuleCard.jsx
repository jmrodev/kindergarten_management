import React from 'react';
import { FolderFill } from 'react-bootstrap-icons';
import ActionItem from './ActionItem.jsx';
import { isProtectedPermission } from '../../utils/permissionUtils.js';

const ModuleCard = ({
  moduleName,
  moduleId,
  moduleKey,
  roleName,
  actions,
  permissions,
  roleId,
  moduleIdValue,
  onPermissionToggle
}) => {
  return (
    <div className="module-card">
      <h5 className="module-card-title">
        <FolderFill className="me-2-custom" />
        {moduleName}
      </h5>
      <div className="action-grid">
        {actions.map(action => {
          const isGranted = permissions?.[action.action_key];
          const isProtected = isProtectedPermission(roleName, moduleKey);
          const actionId = action.id;

          return (
            <ActionItem
              key={`${roleId}-${moduleKey}-${action.action_key}`}
              id={`${roleId}-${moduleKey}-${action.action_key}`}
              actionName={action.action_name}
              isGranted={isGranted}
              isProtected={isProtected}
              onToggle={() => onPermissionToggle(roleId, moduleIdValue, actionId, isGranted)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ModuleCard;