export default {
    testEnvironment: 'node',
    transform: {
      '^.+\\.js$': ["@swc/jest"], // Use Babel for ES module transformation
    },
};
  