import React, { useState, useEffect } from 'react';
import { GearFill, InfoCircleFill, FolderFill, ShieldLock, KeyFill, ClipboardDataFill, ShieldCheck, Shield, CheckCircle, XCircle } from 'react-bootstrap-icons';
import { usePermissions } from '../contexts/PermissionsContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../api/api.js';
import '../index.css'; // Import the external CSS file