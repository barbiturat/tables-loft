const webpackConfig = require('./webpack-test.config.js');

module.exports = function (config) {
  config.set({
    basePath: '..',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      './src/**/*.spec.ts',
      './src/**/*.spec.tsx'
    ],
    exclude: [],
    preprocessors: {
      './src/**/*.spec.ts': ['webpack'],
      './src/**/*.spec.tsx': ['webpack']
    },
    // optionally, configure the reporter
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        {
          type: 'html',
          dir: './coverage',
          subdir: '.'
        }
      ]
    },
    webpack: webpackConfig,
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: Infinity
  })
};
