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

const app = express();
const port = packageJson.appSettings.apiServerPort;
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS, PUT, DELETE, PATCH');
  next();
});

login(app, urlencodedParser);
logout(app, urlencodedParser);
getAdminToken(app, urlencodedParser);
sessionHistory(app, urlencodedParser);
startTable(app, urlencodedParser);
stopTable(app, urlencodedParser);
tables(app, urlencodedParser);
updateTableSession(app, urlencodedParser);

/*
app.all('*', function(req, res){
  console.log('req.url', req.url);
});
*/

app.listen(port, function () {
  console.log(`JSON Server is running on port ${port}`);
});
