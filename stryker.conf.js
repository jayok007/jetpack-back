module.exports = function(config) {
  config.set({
    mutator: 'javascript',
    packageManager: 'npm',
    reporters: ['html', 'clear-text', 'progress', 'dashboard'],
    testRunner: 'jest',
    mutate: ['src/**/*.js', '!src/app.js'],
    transpilers: [],
    coverageAnalysis: 'off',
    thresholds: {
      break: 70
    }
  });
};
