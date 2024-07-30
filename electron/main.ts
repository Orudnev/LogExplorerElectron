import { app, session, BrowserWindow, ipcMain  } from 'electron';
import * as path from 'path';
import * as os from 'os';
import installExtension, { REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import {HandleTwoWayCall} from './api';

const reduxDevToolsPath = path.join(
  os.homedir(),
  '/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/4.9.0_0'
);

function createWindow() {
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    //fullscreen:true,
    //autoHideMenuBar:true,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  });

  console.log("****************** subscription");
  ipcMain.on('set-title', handleSetTitle);

  if (app.isPackaged) {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  } else {
    win.loadURL('http://localhost:3000/index.html');

    win.webContents.once("dom-ready", async () => {
      await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
          .then((name) => console.log(`Added Extension:  ${name}`))
          .catch((err) => console.log("An error occurred: ", err))
          .finally(() => {
              win.webContents.openDevTools();
          });
    win.webContents.openDevTools();
 
  });

    // Hot Reloading on 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname,
        '..',
        '..',
        'node_modules',
        '.bin',
        'electron' + (process.platform === "win32" ? ".cmd" : "")),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  }
} 

app.whenReady().then(() => { 
  ipcMain.handle('twoWayCall',HandleTwoWayCall);
  createWindow();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


  // app.on('ready', () => {
  //   installExtension(REACT_DEVELOPER_TOOLS)
  //     .then((name) => console.log(`Added Extension: ${name}`))
  //     .catch((err) => console.log('An error occurred: ', err));
  // });
  // app.on('ready', () => {
  //   installExtension(REDUX_DEVTOOLS)
  //     .then((name) => {
  //       console.log(`Added Extension: ${name}`);
  //       let n = name;
  //       let s = 1;  
  //     })
  //     .catch((err) => {
  //       let e = err;
  //       console.log('An error occurred: ', err);
  //     });
  // });


function handleSetTitle (event:any, title:string) {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win?.setTitle(title);
}

// session.defaultSession.loadExtension(reduxDevToolsPath).then((arg)=>{
//   let s =1;
// });  

