const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const appSettings = require('../package.json').appSettings;

const ROLLBAR_TOKEN = process.env.ROLLBAR_TOKEN || '';
const isProd = process.argv.includes('-p');
const nodeEnv = isProd ? 'production' : 'development';
const sourcePath = pathFromRoot('./src');
const outputPath = pathFromRoot('./public/resources');

function pathFromRoot(url = '') {
  return path.resolve(__dirname, '..', url);
}

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      ROLLBAR_TOKEN: JSON.stringify(ROLLBAR_TOKEN),
      NODE_ENV: JSON.stringify(nodeEnv)  // NODE_ENV: '"production"' for decreasing size of react library
    }
  }),
  new webpack.LoaderOptionsPlugin({
    test: /\.scss$/,
    options: {
      context: sourcePath,
      debug: true,
      postcss: () => [
        autoprefixer({
          browsers: ['> 1%', 'IE 7']
        })
      ]
    }
  })
];

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
