// electron/main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const WebTorrent = require('webtorrent');
const path = require('path');

let mainWindow;
const client = new WebTorrent();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL('http://localhost:3000'); // your Next.js frontend
}

ipcMain.handle('torrent-play', async (event, { infoHash, fileIdx = 0 }) => {
  return new Promise((resolve, reject) => {
    const magnet = `magnet:?xt=urn:btih:${infoHash}`;

    client.add(magnet, (torrent) => {
      const file = torrent.files[fileIdx];
      file.getBlob((err, blob) => {
        if (err) return reject(err);
        const url = URL.createObjectURL(blob);
        resolve(url);
      });
    });
  });
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
