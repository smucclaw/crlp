import * as vscode from 'vscode';

// nlg
function generateNaturalLanguage(l4code: string): string {
  if (l4code.includes("GIVEN dog IS A Dog")) {
    return "The dog.";
  } else if (l4code.includes("GIVEN")) {return "given.";}
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

      // reset preview panel onclose
      panel.onDidDispose(() => {
        panel = undefined;
      });
    }
  }

  // listen changes and realtime update
  context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document === event.document) {
      const l4Code = editor.document.getText();
      const naturalLanguagePreview = generateNaturalLanguage(l4Code);
      if (panel) {
        panel.webview.html = getWebviewContent(naturalLanguagePreview);
      }
    }
  }));

  let disposable = vscode.commands.registerCommand('nlg-preview.showPreview', () => {
    showPreview();
  });

  // automatically display preview for opened docs
  context.subscriptions.push(vscode.workspace.onDidOpenTextDocument((document) => {
    try {
      const fileExtension = document.fileName.split('.').pop();
      if (fileExtension === 'l4') {
        showPreview();
      }
    } catch (error) {
      console.error('error in onDidOpenTextDocument:', error);
    }
  }));

  // automatically display preview for new docs
  context.subscriptions.push(vscode.workspace.onDidCreateFiles((event) => {
    try {
      for (const file of event.files) {
        if (file.fsPath.endsWith('.l4')) {
          vscode.workspace.openTextDocument(file).then((document) => {
            vscode.window.showTextDocument(document);
            showPreview();
          });
        }
      }
    } catch (error) {
      console.error('error in onDidCreateFiles:', error);
    }
  }));

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