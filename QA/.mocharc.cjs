module.exports = {
  spec: 'specs/**/*.spec.js',
  timeout: 30000,
  reporter: 'mocha-multi-reporters',
  'reporter-option': ['configFile=reporter-config.json'],
  exit: true,
};
