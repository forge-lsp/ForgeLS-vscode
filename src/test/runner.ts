import * as path from "node:path";
import * as Mocha from "mocha";

export function run(): Promise<void> {
  const mocha = new Mocha({ ui: "tdd", timeout: 20000 });
  mocha.addFile(path.resolve(__dirname, "suite", "extension.suite.js"));
  return new Promise<void>((resolve, reject) => {
    mocha.run((failures) => {
      if (failures > 0) {
        reject(new Error(`${failures} integration tests failed`));
        return;
      }
      resolve();
    });
  });
}
