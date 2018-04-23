module.exports = {
  verbose: true,
  roots: [
    '<rootDir>/../../app/mobile',
    '<rootDir>/../../app',
  ],
  moduleDirectories: [
    'node_modules',
    'app/mobile',
    'app',
  ],
  testMatch: [
    '<rootDir>/../../app/(helpers|utils|mobile)/**/tests/*.test.js',
  ],
  setupTestFrameworkScriptFile: '<rootDir>/jest-test-bundler.js',
  globals: {
    __baseUrl__: '',
    zefoGlobals: {},
    __socketUrl__: '',
    __socketNamespace__: '',
  },
  moduleNameMapper: {
    '.+\\.(png|svg)$': '<rootDir>/../mocks/image.js',
    'components/Icon': '<rootDir>/../mocks/image.js',
    'components/ValuePropsStrip': '<rootDir>/../mocks/image.js',
    'ui/CategoryIcon|CityIcon': '<rootDir>/../mocks/image.js',
  },
};
