import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import { getProcessEnv } from '../src/helpers/process-env';
// tslint:disable-next-line:no-require-imports
const auth: any = require('http-auth');

// tslint:disable-next-line:no-require-imports
const packageJson = require('../../../package.json');

const envVars = getProcessEnv();
const envVarStubs = packageJson.appSettings.envVarStubs;
const publicPath = pathFromRoot('public');
const app = express();
const port = envVars.PORT || envVarStubs.ASSETS_PORT;
const authUserName =
  envVars.BASIC_AUTH_USERNAME || envVarStubs.BASIC_AUTH_USERNAME;
const authUserPassword =
  envVars.BASIC_AUTH_PASSWORD || envVarStubs.BASIC_AUTH_PASSWORD;

if (!port) {
  throw 'The "PORT" env variable must be set';
}
if (!authUserName) {
  throw 'The "BASIC_AUTH_USERNAME" env variable must be set';
}
if (!authUserPassword) {
  throw 'The "BASIC_AUTH_PASSWORD" env variable must be set';
}

function pathFromRoot(url = '') {
  return path.resolve(__dirname, '../../..', url);
}

const basicAuth = auth.basic(
  {
    realm: 'App'
  },
  (username: string, password: string, callback: Function): void => {
    const toPass = username === authUserName && password === authUserPassword;

    callback(toPass);
  }
);

app.use(auth.connect(basicAuth));

app.use(express.static(publicPath));

app.get('/', function(req, res) {
  res.sendfile(`${publicPath}/index.html`);
});

http.createServer(app).listen(port, function() {
  console.log(`Server is running on port ${port}`);
});
