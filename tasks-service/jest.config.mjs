export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: true,
  testMatch: ['**/tests/unit/?(*.)+(spec|test).ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/controllers/TaskController.ts",
    "src/services/ExternalAPIService.ts"
  ],
};

