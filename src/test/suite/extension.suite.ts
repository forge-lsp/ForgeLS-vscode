import * as assert from "node:assert";
import * as vscode from "vscode";

function fixtureUri(): vscode.Uri {
  const folders = vscode.workspace.workspaceFolders;
  if (folders === undefined || folders.length === 0) {
    throw new Error("fixture workspace folder is not open");
  }
  const first = folders[0];
  if (first === undefined) {
    throw new Error("fixture workspace folder is missing");
  }
  return vscode.Uri.joinPath(first.uri, "hello.sol");
}

suite("ForgeLS integration suite", () => {
  test("registers solidity language", async () => {
    const ids = await vscode.languages.getLanguages();
    assert.ok(ids.includes("solidity"), "solidity must be registered");
  });

  test("provides forgels defaults", () => {
    const section = vscode.workspace.getConfiguration("forgels");
    assert.strictEqual(section.get("trace"), "off");
    assert.strictEqual(section.get("serverPath"), "");
    assert.strictEqual(section.get("enableSolidity"), true);
    assert.strictEqual(section.get("enableCairo"), false);
  });

  test("opens fixture as solidity without starting a client", async () => {
    const section = vscode.workspace.getConfiguration("forgels");
    await section.update("enableSolidity", false, vscode.ConfigurationTarget.Workspace);
    try {
      const doc = await vscode.workspace.openTextDocument(fixtureUri());
      assert.strictEqual(doc.languageId, "solidity");
    } finally {
      await section.update("enableSolidity", undefined, vscode.ConfigurationTarget.Workspace);
    }
  });
});
