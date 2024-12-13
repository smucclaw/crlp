import vscode from 'vscode';
import { showViz } from './viz';
import { RuleToJson } from './ruleToJson';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('viz.showViz', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const rule = editor.document.getText();
      const json = RuleToJson.parse(rule);
      showViz(context, json);
    }
  });

  context.subscriptions.push(disposable);

  // on Button. the button is at the bottom right of the status bar.

  const button = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  button.command = 'viz.showViz';
  button.text = 'Update Diagram';
  button.tooltip = 'Show visualisation';
  button.show();


  // on save
  vscode.workspace.onDidSaveTextDocument((document) => {
    if (document === vscode.window.activeTextEditor?.document) {
      const rule = document.getText();
      const json = RuleToJson.parse(rule);
      showViz(context, json);
    }
  });
}

export function deactivate() {}