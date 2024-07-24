import { contextBridge, ipcRenderer } from 'electron';

console.log("***************** preload *********************");
console.log(contextBridge.exposeInMainWorld);

contextBridge.exposeInMainWorld('elapi', {
  setTitle: (title:string) => ipcRenderer.send('set-title', title)
}); 