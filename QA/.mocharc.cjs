module.exports = {
  spec: 'specs/**/*.spec.js',
  timeout: 30000,
  reporter: 'allure-mocha',
  'reporter-option': ['resultsDir=allure-results'],
  exit: true,
};
