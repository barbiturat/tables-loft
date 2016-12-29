import * as express from 'express';
import * as bodyParser from 'body-parser';

import login from './endpoints/login';
import logout from './endpoints/logout';
import getAdminToken from './endpoints/get-admin-token';
import sessionHistory from './endpoints/session-history';
import startTable from './endpoints/start-table';
import stopTable from './endpoints/stop-table';
import tables from './endpoints/tables';
import updateTableSession from './endpoints/update-table-session';

// tslint:disable-next-line:no-require-imports
const packageJson = require('../../../package.json');

const server = express();
const port = packageJson.appSettings.apiServerPort;
const urlencodedParser = bodyParser.urlencoded({ extended: false });

login(server, urlencodedParser);
logout(server, urlencodedParser);
getAdminToken(server, urlencodedParser);
sessionHistory(server, urlencodedParser);
startTable(server, urlencodedParser);
stopTable(server, urlencodedParser);
tables(server, urlencodedParser);
updateTableSession(server, urlencodedParser);

server.listen(port, function () {
  console.log(`JSON Server is running on port ${port}`);
});
