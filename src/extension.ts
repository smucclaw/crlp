import * as vscode from 'vscode';
import { generateNaturalLanguage } from './preview';

// nlg

export function activate(context: vscode.ExtensionContext) {
  let panel: vscode.WebviewPanel | undefined;

  async function showPreview() {
    if (!panel) {
      panel = vscode.window.createWebviewPanel(
        'nlgPreview',
        'Natural Language Preview',
        vscode.ViewColumn.Beside,
        {}
      );

      const editor = vscode.window.activeTextEditor;
      if (editor) {
        // Check if cabal project path is configured
        const config = vscode.workspace.getConfiguration('l4preview');
        const cabalProjectPath = config.get<string>('cabalProjectPath');

        if (!cabalProjectPath) {
          panel.webview.html = getWebviewContent(
            'Error: no Cabal project path. Please set cabalProjectPath in settings.'
          );
          return;
        }

        const l4code = editor.document.getText();
        try {
          const naturalLanguagePreview = await generateNaturalLanguage(l4code, context);
          panel.webview.html = getWebviewContent(naturalLanguagePreview);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          panel.webview.html = getWebviewContent(`Error: ${errorMessage}`);
          
          // Show error message in VS Code
          vscode.window.showErrorMessage(`L4 Preview Error: ${errorMessage}`);
        }
      } else {
        panel.webview.html = getWebviewContent("Error: No active editor");
      }

      panel.onDidDispose(() => {
        panel = undefined;
      });
    }
  }

  context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(async event => {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document === event.document) {
      const config = vscode.workspace.getConfiguration('l4preview');
      const cabalProjectPath = config.get<string>('cabalProjectPath');

      if (!cabalProjectPath) {
        if (panel) {
          panel.webview.html = getWebviewContent(
            'Error: Cabal project path not configured. Please set l4preview.cabalProjectPath in settings.'
          );
        }
        return;
      }

      const l4Code = editor.document.getText();
      try {
        const naturalLanguagePreview = await generateNaturalLanguage(l4Code, context);
        if (panel) {
          panel.webview.html = getWebviewContent(naturalLanguagePreview);
        }
      } catch (error) {
        if (panel) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          panel.webview.html = getWebviewContent(`Error: ${errorMessage}`);
          vscode.window.showErrorMessage(`L4 Preview Error: ${errorMessage}`);
        }
      }
    }
  }));

  let disposable = vscode.commands.registerCommand('nlg-preview.showPreview', () => {
    showPreview();
  });

  context.subscriptions.push(disposable);
}

// Webview HTML
function getWebviewContent(naturalLanguagePreview: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Natural Language Preview</title>
    </head>
    <body>
      <h1>Natural Language Preview</h1>
      <p>${naturalLanguagePreview}</p>
    </body>
    </html>
  `;
}

export function deactivate() {}