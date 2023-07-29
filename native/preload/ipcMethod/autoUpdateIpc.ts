import { ipcRenderer } from 'electron'
import { IpcMainChannel, IpcWebContentChannel } from '../ipcChannel'

export default {
  onError: (listener: (...args: any[]) => void) =>
    ipcRenderer.addListener(IpcWebContentChannel.AutoUpdate.ERROR, listener),
  onCheckingForUpdate: (listener: (...args: any[]) => void) =>
    ipcRenderer.addListener(
      IpcWebContentChannel.AutoUpdate.CHECKING_FOR_UPDATE,
      listener
    ),
  onUpdateAvailable: (listener: (...args: any[]) => void) =>
    ipcRenderer.addListener(
      IpcWebContentChannel.AutoUpdate.UPDATE_AVAILABLE,
      listener
    ),
  onUpdateNotAvailable: (listener: (...args: any[]) => void) =>
    ipcRenderer.addListener(
      IpcWebContentChannel.AutoUpdate.UPDATE_NOT_AVAILABLE,
      listener
    ),
  onDownloadProgress: (listener: (...args: any[]) => void) =>
    ipcRenderer.addListener(
      IpcWebContentChannel.AutoUpdate.DOWNLOAD_PROGRESS,
      listener
    ),
  // 仅在非自动下载时有效
  onUpdateDownloaded: (listener: (...args: any[]) => void) =>
    ipcRenderer.addListener(
      IpcWebContentChannel.AutoUpdate.UPDATE_DOWNLOADED,
      listener
    ),

  onUpdateCancelled: (listener: (...args: any[]) => void) =>
    ipcRenderer.addListener(
      IpcWebContentChannel.AutoUpdate.UPDATE_CANCELLED,
      listener
    ),
  onCanInstallUpdate: (listener: (...args: any[]) => void) =>
    ipcRenderer.addListener(
      IpcWebContentChannel.AutoUpdate.CAN_INSTALL_UPDATE,
      listener
    ),

  // 仅在非自动下载时有效
  checkUpdates: (url: string, desc: string) =>
    ipcRenderer.invoke(IpcMainChannel.AutoUpdate.CHECK_UPDATES, url, desc),
  downloadUpdate: () =>
    ipcRenderer.invoke(IpcMainChannel.AutoUpdate.DOWNLOAD_UPDATE),
  installUpdate: () =>
    ipcRenderer.invoke(IpcMainChannel.AutoUpdate.INSTALL_UPDATE)
}
