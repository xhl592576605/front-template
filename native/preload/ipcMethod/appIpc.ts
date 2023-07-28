import { ipcRenderer } from 'electron'
import { IpcMainChannel } from '../ipcChannel'

export default {
  quit: () => ipcRenderer.invoke(IpcMainChannel.App.QUIT),
  close: () => ipcRenderer.invoke(IpcMainChannel.App.CLOSE),
  relaunch: () => ipcRenderer.invoke(IpcMainChannel.App.RELAUNCH),
  minimize: () => ipcRenderer.invoke(IpcMainChannel.App.MINIMIZE),
  maximize: () => ipcRenderer.invoke(IpcMainChannel.App.MAXIMIZE),
  fullscreen: (isFullScreen = true) =>
    ipcRenderer.invoke(IpcMainChannel.App.FULLSCREEN, isFullScreen),
  restoreMainWindow: () =>
    ipcRenderer.invoke(IpcMainChannel.App.RESTORE_MAIN_WINDOW)
}
