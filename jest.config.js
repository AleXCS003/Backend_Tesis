export default {
    transform: {
      '^.+\\.js$': 'babel-jest',
    },
    transformIgnorePatterns: ['/node_modules/(?!(mi-dependencia-es6)/)'],
    testEnvironment: "node",
    globals: {
      'babel-jest': {
        useESModules: true,
      },
      'import.meta': { url: 'file://fake-path/to/file.js' }      
    },
  };