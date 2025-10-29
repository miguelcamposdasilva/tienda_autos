const path = require('path');

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      { pattern: 'test/unit/**/*.spec.js', type: 'module' }
    ],
    preprocessors: {
      'test/unit/**/*.spec.js': ['webpack']
    },
    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: { node: 'current' } }],
                  ['@babel/preset-react', { runtime: 'automatic' }]
                ]
              }
            }
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          }
        ]
      },
      resolve: {
        extensions: ['.js', '.jsx']
      }
    },
    webpackMiddleware: { stats: 'errors-only' },
    reporters: ['progress', 'kjhtml', 'coverage'],
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },
    browsers: ['ChromeHeadless'],
    singleRun: true,
    client: {
      clearContext: false
    }
  });
};
