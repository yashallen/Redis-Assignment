module.exports = {
  verbose: true,
  roots: [
    '<rootDir>/../../app/desktop',
    '<rootDir>/../../app',
  ],
  moduleDirectories: [
    'node_modules',
    'app/desktop',
    'app',
  ],
  testMatch: [
    '<rootDir>/../../app/(helpers|utils|desktop)/**/tests/*.test.js',
  ],
  setupTestFrameworkScriptFile: '<rootDir>/jest-test-bundler.js',
  globals: {
    __baseUrl__: '',
    zefoGlobals: {},
  },
  moduleNameMapper: {
    '.+\\.(png|svg)$': '<rootDir>/../mocks/image.js',
    'components/Icon': '<rootDir>/../mocks/image.js',
    'ui/CategoryIcon|CityIcon': '<rootDir>/../mocks/image.js',
  },
};
