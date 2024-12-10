import * as vscode from 'vscode';
import { startDevServer } from './dev-server';

export function activate(context: vscode.ExtensionContext) {
  let panel: vscode.WebviewPanel | undefined;
  let devServer: { dispose: () => void } | undefined;

  function createWebview() {
    panel = vscode.window.createWebviewPanel(
      'sveltePreview',
      'Vis Preview',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true
      }
    );

    const liveReloadScript = `
      <script src="/socket.io/socket.io.js"></script>
      <script>
        const socket = io('http://localhost:3000');
        socket.on('fileChanged', (data) => {
          console.log('File changed:', data.path);
          window.location.reload();
        });
      </script>
    `;

    panel.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Visualisation</title>
      </head>
      <body>
        <iframe 
          src="http://localhost:3000" 
          style="position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:900;"
        ></iframe>
        <script src="/socket.io/socket.io.js"></script>
        <script>
          const socket = io('http://localhost:3000');
          socket.on('fileChanged', (data) => {
            console.log('File changed:', data.path);
            window.location.reload();
          });
        </script>
      </body>
      </html>
    `;

    panel.onDidDispose(() => {
      panel = undefined;
    });
  }

  devServer = startDevServer(context);

  let disposable = vscode.commands.registerCommand('svelte-preview.show', () => {
    createWebview();
  });

  context.subscriptions.push(
    disposable,
    { dispose: () => devServer?.dispose() }
  );
}

export function deactivate() {}