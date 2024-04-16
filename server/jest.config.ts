import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  preset: 'ts-jest',
  runner: 'groups',
  testEnvironment: 'node',
  collectCoverage: false,
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**'],
};
export default config;
