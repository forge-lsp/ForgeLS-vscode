import { spawn } from "node:child_process";
import * as path from "node:path";
import { downloadAndUnzipVSCode } from "@vscode/test-electron";

async function main(): Promise<void> {
  delete process.env.ELECTRON_RUN_AS_NODE;
  const root = path.resolve(__dirname, "..");
  const executable = await downloadAndUnzipVSCode("stable");
  const fixture = path.join(root, "test-fixtures", "basic");
  const args = [
    "--no-sandbox",
    "--disable-gpu-sandbox",
    "--disable-updates",
    "--skip-welcome",
    "--skip-release-notes",
    "--no-cached-data",
    "--disable-workspace-trust",
    fixture,
    path.join(fixture, "hello.sol"),
    `--extensionDevelopmentPath=${root}`,
    "--disable-extensions",
    "--new-window",
    `--user-data-dir=${path.join(root, ".vscode-test", "live-profile")}`,
  ];
  const child = spawn(executable, args, { stdio: "inherit" });
  const forward = (): void => {
    child.kill("SIGINT");
  };
  process.on("SIGINT", forward);
  await new Promise<void>((resolve) => {
    child.on("exit", () => resolve());
  });
  process.removeListener("SIGINT", forward);
}

main().catch(() => {
  process.exitCode = 1;
});
