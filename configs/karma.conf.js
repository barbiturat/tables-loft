var webpackConfig = require('./webpack-test.config.js');

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'chai', 'sinon'],
        files: [
            '../src/**/*.spec.ts'
        ],
        exclude: [],
        preprocessors: {
            '../src/**/*.spec.ts': ['webpack']
        },
        // optionally, configure the reporter
        coverageReporter: {
          dir: 'coverage',
          reporters: [
              {
                  type: 'json',
                  dir: '../coverage',
                  subdir: '.',
                  file: 'coverage-raw.json'
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
