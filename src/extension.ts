import vscode from 'vscode';
import { showViz } from './viz';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('viz.showViz', () => {
    showViz(context);
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}