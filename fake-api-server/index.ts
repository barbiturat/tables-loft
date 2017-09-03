import * as express from 'express';

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

const app = express();
const port = packageJson.appSettings.envVarStubs.API_PORT;

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS, PUT, DELETE, PATCH');
  next();
});

login(app);
logout(app);
getAdminToken(app);
sessionHistory(app);
startTable(app);
stopTable(app);
tables(app);
updateTableSession(app);

/*
app.all('*', function(req, res){
  console.log('req.url', req.url);
});
*/

app.listen(port, function() {
  console.log(`JSON Server is running on port ${port}`);
});
