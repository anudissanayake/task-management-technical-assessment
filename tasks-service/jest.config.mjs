export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  // testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/controllers/TaskController.ts", // Adjust the path to your source file
  ],
  testMatch: ["**/tests/unit/TaskController.spec.ts"], // Explicitly match your test file
};

