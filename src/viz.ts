import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('extension loaded');

  let panel: vscode.WebviewPanel | undefined;

  function showViz() {
    if (!panel) {
      panel = vscode.window.createWebviewPanel(
        'viz',
        'Visualisation',
        vscode.ViewColumn.Beside,
        { 
          enableScripts: true,
          retainContextWhenHidden: true
        }
      );
  
      const fakeJson = {
        andOr: {
          tag: 'All',
          children: [
            {
              andOr: {
                tag: 'Leaf',
                contents: 'does the person walk?',
              },
              mark: {
                value: 'undefined',
                source: 'user',
              },
              prePost: {},
              shouldView: 'Ask',
            },
            {
              andOr: {
                tag: 'Any',
                children: [
                  {
                    andOr: {
                      tag: 'Leaf',
                      contents: 'does the person eat?',
                    },
                    mark: {
                      value: 'undefined',
                      source: 'user',
                    },
                    prePost: {},
                    shouldView: 'Ask',
                  },
                  {
                    andOr: {
                      tag: 'Leaf',
                      contents: 'does the person drink?',
                    },
                    mark: {
                      value: 'undefined',
                      source: 'user',
                    },
                    prePost: {},
                    shouldView: 'Ask',
                  },
                ],
              },
              mark: {
                value: 'undefined',
                source: 'user',
              },
              prePost: {
                Pre: 'any of:',
              },
              shouldView: 'View',
            },
          ],
        },
        mark: {
          value: 'undefined',
          source: 'user',
        },
        prePost: {
          Pre: 'all of:',
        },
        shouldView: 'View',
      };
  
      panel.webview.html = getWebviewContent(panel, fakeJson, context);
  
      panel.onDidDispose(() => {
        panel = undefined;
      });
    }
  }

  context.subscriptions.push(
    vscode.commands.registerCommand('viz.showViz', () => {
      console.log('viz command triggered');
      showViz();
    })
  );
}

function getWebviewContent(
  panel: vscode.WebviewPanel,
  fakeJson: any,
  context: vscode.ExtensionContext
){
  const vizJsUri = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, 'dist', 'viz.bundle.js')
  );

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rule Ladder Diagram</title>
      <style>
        body { 
          margin: 0; 
          padding: 20px; 
          font-family: Arial, sans-serif; 
        }
        #ladder-container {
          width: 100%;
          height: 100vh;
        }
      </style>
    </head>
    <body>
      <h2>Visualisation</h2>
      <div id="ladder-container"></div>
      <div>${JSON.stringify(fakeJson, null, 2)}</div>  
      <script src="${vizJsUri}"></script>    
      <script>
        function q2circuit(q) {
          if (q.andOr.tag === 'Leaf') {
            const utf = 
              q.mark.value === 'undefined' ? 'U' :
              q.mark.value === 'true' ? 'T' :
              q.mark.value === 'false' ? 'F' : null;
            
            return new LadderDiagram.BoolVar(
              q.andOr.contents, 
              false, 
              q.mark.source === 'default' ? utf : null,
              q.mark.source === 'user' ? utf : null
            );
          }
          
          const Construct = q.andOr.tag === 'All' ? 
            LadderDiagram.AllQuantifier : 
            LadderDiagram.AnyQuantifier;
          
          return new Construct(
            q.andOr.children.map(c => q2circuit(c))
          );
        }

        function renderDiagram() {
          const fakeJson = ${JSON.stringify(fakeJson)};
          const circuit = q2circuit(fakeJson);
          const ld = new LadderDiagram(circuit);
          console.log(fakeJson, circuit)
          ld.attach(document.getElementById('ladder-container'));
        }

        if (window.LadderDiagram) {
          console.log("ladder diagram exists", window.LadderDiagram);
          renderDiagram();
        } else {
          console.log("ladder diagram exists not", window.LadderDiagram);
          document.addEventListener('DOMContentLoaded', renderDiagram);
        }
      </script>
    </body>
    </html>
  `;
}

export function deactivate() {}