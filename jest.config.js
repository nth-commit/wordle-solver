/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: {
        esModuleInterop: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
      },
    },
  },
}
