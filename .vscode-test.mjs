import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
  files: 'dist/test/**/*.suite.js',
  version: 'stable',
  workspaceFolder: './test-fixtures/basic',
  launchArgs: ['--disable-extensions'],
  mocha: {
    ui: 'tdd',
    timeout: 20000,
  },
});
