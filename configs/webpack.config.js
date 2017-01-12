const webpack = require('webpack');
const path = require('path');

const sourcePath = pathFromRoot('./src');
const outputPath = pathFromRoot('./public/resources');

function pathFromRoot(url = '') {
  return path.resolve(__dirname, '..', url);
}

module.exports = {
  context: sourcePath,
  entry: {
    rollbar: './external-tools/rollbar-snippet.js'
  },
  output: {
    filename: '[name].js',
    path: outputPath
  }
};
