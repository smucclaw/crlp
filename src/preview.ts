import * as cp from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';

import { ExtensionContext } from 'vscode';
export function generateNaturalLanguage(l4code: string, context: vscode.ExtensionContext): Promise<string> {
  return new Promise((resolve, reject) => {
    // save code from code window to tmp file
    const tmpDir = process.env.TMPDIR || '/tmp';
    const tmpFile = path.join(tmpDir, 'temp.l4');
    
    try {
      fs.writeFileSync(tmpFile, l4code);
      
      // execute
      const workingDir = '/../lam4'; // TODO: Update this path
      
      cp.exec(
        `cabal run lam4-cli -- --nlg-only "${tmpFile}"`,
        { cwd: workingDir },
        (error, stdout, stderr) => {
          try {
            fs.unlinkSync(tmpFile);
          } catch (cleanupError) {
            console.error('Error cleaning up temp file:', cleanupError);
          }

          if (error) {
            console.error(`Execution error: ${error}`);
            reject(error);
            return;
          }

          if (stderr) {
            console.error(`stderr: ${stderr}`);
          }

          resolve(stdout);
        }
      );
    } catch (error) {
      try {
        if (fs.existsSync(tmpFile)) {
          fs.unlinkSync(tmpFile);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }
      
      reject(error);
    }
  });
}
