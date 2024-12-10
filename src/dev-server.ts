import express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';
import * as path from 'path';
import cors from 'cors';
import * as chokidar from 'chokidar';
import * as vscode from 'vscode';

export function startDevServer(context: vscode.ExtensionContext) {
  const app = express();
  const server = http.createServer(app);
  const io = new socketIo.Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const visPath = vscode.workspace.workspaceFolders![0].uri.fsPath;
  const buildPath = path.join(visPath, 'dist');
  
  app.use(cors());
  app.use(express.static(buildPath));

  app.get('*', (req: any, res: { sendFile: (arg0: string) => void; }) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });

  io.on('connection', (socket) => {
    console.log('Client connected');
  });

  const watcher = chokidar.watch(visPath, {
    ignored: /(node_modules|\.git|dist)/,
    persistent: true
  });

  watcher.on('change', (path) => {
    console.log(`File ${path} has been changed`);
    io.emit('fileChanged', { path });
  });

  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`Dev server running on http://localhost:${PORT}`);
  });

  return {
    dispose: () => {
      watcher.close();
      server.close();
    }
  };
}