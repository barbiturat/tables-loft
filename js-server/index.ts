import * as express from 'express';
import * as http from 'http';
import * as path from 'path';

// tslint:disable-next-line:no-require-imports
const packageJson = require('../../../package.json');
const publicPath = pathFromRoot('public');
const app = express();
const port = process.env.PORT || packageJson.appSettings.assetsServerPort;

function pathFromRoot(url = '') {
  return path.resolve(__dirname, '../../..', url);
}

app.use(express.static(publicPath));

app.get('/', function(req, res){
  res.sendfile(`${publicPath}/index.html`);
});

http.createServer(app)
  .listen(port, function () {
    console.log(`Server is running on port ${port}`);
  });