import {Table as StoreTable, TableSession} from './store-models';

export interface Table extends StoreTable {
  currentSession?: TableSession;
  lastSession?: TableSession;
}
