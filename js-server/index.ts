import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
// tslint:disable-next-line:no-require-imports
const auth: any = require('http-auth');

// tslint:disable-next-line:no-require-imports
const packageJson = require('../../../package.json');
const publicPath = pathFromRoot('public');
const app = express();
const port = process.env.PORT || packageJson.appSettings.assetsServerPort;
const authUserName = process.env.BASIC_AUTH_USERNAME || '';
const authUserPassword = process.env.BASIC_AUTH_PASSWORD || '';

function pathFromRoot(url = '') {
  return path.resolve(__dirname, '../../..', url);
}

const basicAuth = auth.basic({
    realm: 'App'
  },
  (username: string, password: string, callback: Function): void => {
    const toPass = username === authUserName && password === authUserPassword;

    callback(toPass);
  }
);

app.use(auth.connect(basicAuth));

app.use(express.static(publicPath));

app.get('/', function(req, res){
  res.sendfile(`${publicPath}/index.html`);
});

http.createServer(app)
  .listen(port, function () {
    console.log(`Server is running on port ${port}`);
  });
