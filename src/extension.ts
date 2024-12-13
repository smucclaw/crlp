import vscode from 'vscode';
import { showViz } from './viz';
import { RuleToJson } from './ruleToJson';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('viz.showViz', () => {
    showViz(context);
  });

  context.subscriptions.push(disposable);

  vscode.workspace.onDidSaveTextDocument((document) => {
    if (document === vscode.window.activeTextEditor?.document) {
      const rule = document.getText();
      const json = RuleToJson.parse(rule);
      showViz(context, json);
    }
  });
}

export function deactivate() {}