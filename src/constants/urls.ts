import {API_PREFIX} from './index';

export const urlGetAdminToken = `${API_PREFIX}/api_tokens.json`;
export const urlLogin = `${API_PREFIX}/login`;
export const urlLogout = `${API_PREFIX}/logout`;
export const urlSessionHistory = `${API_PREFIX}/table_sessions/history.json`;
export const urlStartTable = `${API_PREFIX}/tables/:table_id/start.json`;
export const urlStopTable = `${API_PREFIX}/tables/:table_id/stop.json`;
export const urlTables = `${API_PREFIX}/tables.json`;
export const urlUpdateTableSession = `${API_PREFIX}/table_sessions/:table_id.json`;
