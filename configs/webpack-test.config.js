const webpackConfig = require('./webpack.config');

const newRules = webpackConfig.module.rules.concat({
  enforce: 'post',
  test: /\.tsx?$/,
  loader: 'istanbul-instrumenter-loader',
  exclude: [
    'node_modules',
    /\.(e2e|spec)\.ts$/
  ],
  options: {
    esModules: true
  }
});

// remove commonsChunkPlugin, because karma can't build with it
const newPlugins = webpackConfig.plugins.filter((plugin) => !plugin.chunkNames);

const newConfig = Object.assign({}, webpackConfig, {
  module: Object.assign({}, webpackConfig.module, {
    rules: newRules
  }),
  plugins: newPlugins
});

module.exports = newConfig;
