import {Table as BackendTable} from '../../interfaces/backend-models';
import {Table as FrontendTable} from '../../interfaces/store-models';

export const tablesToFront = (tables: BackendTable[]): FrontendTable[] => {
  return tables.map((table) => {
    const currentSessionId = table.currentSession ? table.currentSession.id : null;
    const lastSessionId = table.lastSession ? table.lastSession.id : null;

    return {
      name: table.name,
      id: table.id,
      tableType: table.tableType,
      status: table.status,
      currentSessionId,
      lastSessionId,
      isInPending: false
    };
  });
};
