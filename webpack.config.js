const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin');

const envVarStubs = require('./package.json').appSettings.envVarStubs;

const envVars = process.env;
const isProd = process.argv.includes('-p');

const API_KEY = isProd
  ? envVars.API_KEY
  : envVarStubs.API_KEY || envVars.API_KEY;
const API_HOST = isProd
  ? envVars.API_HOST
  : envVarStubs.API_HOST || envVars.API_HOST;
const API_PORT = isProd
  ? envVars.API_PORT
  : envVarStubs.API_PORT || envVars.API_PORT;
const ROLLBAR_TOKEN = isProd
  ? envVars.ROLLBAR_TOKEN
  : envVarStubs.ROLLBAR_TOKEN || envVars.ROLLBAR_TOKEN;
const ROLLBAR_SERVER_TOKEN = isProd
  ? envVars.ROLLBAR_SERVER_TOKEN
  : envVarStubs.ROLLBAR_SERVER_TOKEN || envVars.ROLLBAR_SERVER_TOKEN;

const nodeEnv = isProd ? 'production' : 'development';
const sourcePath = pathFromRoot('./src');
const outputPath = pathFromRoot('./public');

function pathFromRoot(url = '') {
  return path.resolve(__dirname, url);
}

if (!API_KEY) throw 'The "API_KEY" env variable must be set';
if (!API_HOST) throw 'The "API_HOST" env variable must be set';
if (!API_PORT) throw 'The "API_PORT" env variable must be set';

const plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    names: ['fonts', 'img', 'bundle', 'manifest']
  }),
  new webpack.DefinePlugin({
    'process.env': {
      API_KEY: JSON.stringify(API_KEY),
      API_HOST: JSON.stringify(API_HOST),
      API_PORT: JSON.stringify(API_PORT),
      ROLLBAR_TOKEN: JSON.stringify(ROLLBAR_TOKEN),
      ROLLBAR_SERVER_TOKEN: JSON.stringify(ROLLBAR_SERVER_TOKEN),
      NODE_ENV: JSON.stringify(nodeEnv) // NODE_ENV: '"production"' for decreasing size of react library
    }
  }),
  new HtmlWebpackPlugin({
    filename: pathFromRoot('./public/index.html'),
    template: `${sourcePath}/index.ejs`
  }),
  new RollbarSourceMapPlugin({
    accessToken: ROLLBAR_SERVER_TOKEN,
    version: Math.random(),
    publicPath: outputPath
  })
];

module.exports = {
  devtool: isProd ? 'source-map' : 'eval',
  context: sourcePath,
  entry: {
    rollbar: '../external-tools/rollbar-snippet.js',
    bundle: './index.tsx',
    img: '../resources/img/index.js',
    fonts: '../resources/fonts/index.js'
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: outputPath
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        loader: 'tslint-loader',
        exclude: /node_modules/,
        options: {
          failOnHint: true,
          // typeCheck: true
        }
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          configFileName: pathFromRoot('./tsconfig.json')
        }
      },
      {
        test: /\.svg$/,
        loader: 'url-loader',
        options: {
          mimetype: 'image/svg+xml',
          limit: 30000
        }
      },
      {
        test: /\.png$/,
        loader: 'url-loader',
        options: {
          mimetype: 'image/png',
          limit: 30000
        }
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'url-loader',
        options: {
          mimetype: 'application/font-woff',
          limit: 30000
        }
      },
      {
        test: /\.eot$/,
        loader: 'url-loader',
        options: {
          mimetype: 'application/vnd.ms-fontobject',
          limit: 30000
        }
      },
      {
        test: /\.(ttf|otf)$/,
        loader: 'url-loader',
        options: {
          mimetype: 'application/octet-stream',
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
              includePaths: [pathFromRoot('./node_modules')]
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: [sourcePath, 'node_modules']
  },
  plugins: plugins
};
