import * as vscode from 'vscode';

// nlg
function generateNaturalLanguage(l4code: string): string {
  if (l4code.includes("GIVEN")) {
    return "given.";
  }
  return "no code";
}

export function activate(context: vscode.ExtensionContext) {
  let panel: vscode.WebviewPanel | undefined;

  function showPreview() {
    if (!panel) {
      panel = vscode.window.createWebviewPanel(
        'nlgPreview',
        'Natural Language Preview',
        vscode.ViewColumn.Beside,
        {} // MAYBE TODO: Webview options
      );

      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const l4code = editor.document.getText();
        const naturalLanguagePreview = generateNaturalLanguage(l4code);
        panel.webview.html = getWebviewContent(naturalLanguagePreview);
      } else {
        panel.webview.html = getWebviewContent("error no preview");
      }

      // listen changes and realtime update
      vscode.workspace.onDidChangeTextDocument(event => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document === event.document) {
          const dslCode = editor.document.getText();
          const naturalLanguagePreview = generateNaturalLanguage(dslCode);
          if (panel) {
            panel.webview.html = getWebviewContent(naturalLanguagePreview);
          }
        }
      });

      // reset preview panel onclose
      panel.onDidDispose(() => {
        panel = undefined;
      });
    }
  }

  let disposable = vscode.commands.registerCommand('nlg-preview.showPreview', () => {
    showPreview();
  });

  // automatically display preview
  vscode.workspace.onDidOpenTextDocument(() => {
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