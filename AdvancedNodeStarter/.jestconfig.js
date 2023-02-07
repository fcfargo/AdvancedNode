module.exports = {
  verbose: true,
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  testTimeout: 10000,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
};
