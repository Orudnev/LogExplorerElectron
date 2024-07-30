import { contextBridge, ipcRenderer } from 'electron';

console.log("***************** preload *********************");
console.log(contextBridge.exposeInMainWorld);

const apiName = 'electronAPI';

contextBridge.exposeInMainWorld(apiName, {
  twoWayCall: (payload:object) => ipcRenderer.invoke('twoWayCall', payload),
});
