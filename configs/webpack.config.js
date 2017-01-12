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
  })
];

module.exports = {
  devtool: isProd ? 'source-map' : 'eval',
  context: sourcePath,
  entry: {
    rollbar: './external-tools/rollbar-snippet.js',
    bundle: './index.tsx'
  },
  output: {
    filename: '[name].js',
    path: outputPath
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          configFileName: pathFromRoot('./configs/tsconfig.json')
        }
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|otf|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 100000
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                pathFromRoot('./node_modules')
              ]
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: [
      sourcePath,
      'node_modules'
    ]
  },
  plugins: plugins
};
