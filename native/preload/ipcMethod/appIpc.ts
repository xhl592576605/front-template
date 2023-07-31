import { ipcRenderer } from 'electron'
import { IpcMainChannel } from '../ipcChannel'

export default {
  // 关于应用基本操作
  quit: () => ipcRenderer.invoke(IpcMainChannel.App.QUIT),
  close: () => ipcRenderer.invoke(IpcMainChannel.App.CLOSE),
  relaunch: () => ipcRenderer.invoke(IpcMainChannel.App.RELAUNCH),
  minimize: () => ipcRenderer.invoke(IpcMainChannel.App.MINIMIZE),
  maximize: () => ipcRenderer.invoke(IpcMainChannel.App.MAXIMIZE),
  fullscreen: (isFullScreen = true) =>
    ipcRenderer.invoke(IpcMainChannel.App.FULLSCREEN, isFullScreen),
  restoreMainWindow: () =>
    ipcRenderer.invoke(IpcMainChannel.App.RESTORE_MAIN_WINDOW),

  // 关于应用设置
  getSetting: () => ipcRenderer.invoke(IpcMainChannel.App.GET_SETTING),
  changeSetting: (setting: any) =>
    ipcRenderer.invoke(IpcMainChannel.App.CHANGE_SETTING, setting),

  // 一些工具函数
  getLogFileBuffer: () => ipcRenderer.invoke(IpcMainChannel.App.GET_LOG_BUFFER)
}
