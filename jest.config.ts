import nextJest from "next/jest";

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testMatch: ["<rootDir>/src/__test__/**/*.(test|spec).ts?(x)"],
};

export default createJestConfig(customJestConfig);
