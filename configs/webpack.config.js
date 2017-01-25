const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const API_KEY = process.env.API_KEY;
const API_HOST = process.env.API_HOST;
const API_PORT = process.env.API_PORT;
const ROLLBAR_TOKEN = process.env.ROLLBAR_TOKEN || '';
const isProd = process.argv.includes('-p');
const nodeEnv = isProd ? 'production' : 'development';
const sourcePath = pathFromRoot('./src');
const outputPath = pathFromRoot('./public/resources');

function pathFromRoot(url = '') {
  return path.resolve(__dirname, '..', url);
}

if (!API_KEY) throw('The "API_KEY" env variable must be set');
if (!API_HOST) throw('The "API_HOST" env variable must be set');
if (!API_PORT) throw('The "API_PORT" env variable must be set');

const plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor', 'manifest']
  }),
  new webpack.DefinePlugin({
    'process.env': {
      API_KEY: JSON.stringify(API_KEY),
      API_HOST: JSON.stringify(API_HOST),
      API_PORT: JSON.stringify(API_PORT),
      ROLLBAR_TOKEN: JSON.stringify(ROLLBAR_TOKEN),
      NODE_ENV: JSON.stringify(nodeEnv)  // NODE_ENV: '"production"' for decreasing size of react library
    }
  }),
  new HtmlWebpackPlugin({
    filename: pathFromRoot('./public/index.html'),
    template: `${sourcePath}/index.ejs`
  })
];

module.exports = {
  devtool: isProd ? 'source-map' : 'eval',
  context: sourcePath,
  entry: {
    rollbar: './external-tools/rollbar-snippet.js',
    bundle: './index.tsx',
    vendor: [
      'classnames',
      'ramda',
      'moment',
      'react',
      'react-dom',
      'react-modal',
      'react-redux',
      'react-redux-form',
      'react-router',
      'redux',
      'redux-observable',
      'redux-router',
      'reselect',
      'rxjs',
      'validator'
    ]
  },
  output: {
    filename: '[name].[chunkhash].js',
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
