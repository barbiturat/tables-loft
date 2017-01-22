const versionPrefix = '/v1';

export const urlGetAdminToken = `${versionPrefix}/admin_tokens.json`;
export const urlLogin = `${versionPrefix}/login`;
export const urlLogout = `${versionPrefix}/logout`;
export const urlSessionHistory = `${versionPrefix}/tables/:table_id/table_sessions/history.json`;
export const urlStartTable = `${versionPrefix}/tables/:table_id/start.json`;
export const urlStopTable = `${versionPrefix}/tables/:table_id/stop.json`;
export const urlTables = `${versionPrefix}/tables.json`;
export const urlUpdateTableSession = `${versionPrefix}/table_sessions/:session_id.json`;
