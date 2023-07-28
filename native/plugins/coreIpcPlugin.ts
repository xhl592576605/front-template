import { ipcMain } from 'electron'
import Core from '../core'
import { IpcMainChannel } from '../preload/ipcChannel'
import { CorePlugin } from './corePlugin'

export default class CoreIpcPlugin implements CorePlugin {
  name = 'core-ipc-plugin'
  apply($core: Core) {
    let ipcMainListenerChannels: string[] = []

    /**
     * 主进程添加监听
     * @param channel
     * @param listener
     */
    const addIpcMainListener = (
      channel: string,
      listener: (...args: any[]) => void
    ) => {
      ipcMainListenerChannels.push(channel)
      ipcMain.handle(channel, listener)
      $core.mainLogger.info(`[ipcMain] add listener: ${channel}`)
    }

    /**
     * 主进程添加一次监听
     * @param channel
     * @param listener
     */
    const addIpcMainListenerOnce = (
      channel: string,
      listener: (...args: any[]) => void
    ) => {
      ipcMainListenerChannels.push(channel)
      ipcMain.handleOnce(channel, (...args) => {
        // 一次性就移除channels
        ipcMainListenerChannels = ipcMainListenerChannels.filter(
          (item) => item !== channel
        )
        return listener(...args)
      })
      $core.mainLogger.info(`[ipcMain] add listener once: ${channel}`)
    }

    /**
     * 主进程移除监听
     * @param channel
     */
    const removeIpcMainListener = (channel: string) => {
      ipcMain.removeHandler(channel)
      ipcMainListenerChannels = ipcMainListenerChannels.filter(
        (item) => item !== channel
      )
      $core.mainLogger.info(`[ipcMain] remove listener : ${channel}`)
    }

    /**
     * 主进程发送消息到渲染进程
     * @param channel
     * @param args
     */
    const sendToIpcRenderer = (channel: string, ...args: any[]) => {
      if ($core.mainWindow) {
        $core.mainLogger.info(
          `[ipcMain] send to renderer: ${channel},args:`,
          ...args
        )
        $core.mainWindow.webContents.send(channel, ...args)
      }
    }

    $core.lifeCycle.afterCreateMainWindow.tap(
      {
        name: this.name,
        stage: -2
      },
      () => {
        $core.addIpcMainListener = addIpcMainListener.bind($core)
        $core.addIpcMainListenerOnce = addIpcMainListenerOnce.bind($core)
        $core.removeIpcMainListener = removeIpcMainListener.bind($core)
        $core.sendToIpcRenderer = sendToIpcRenderer.bind($core)

        /**
         * 注册是否有该ipc监听
         */
        $core.addIpcMainListener(
          IpcMainChannel.CHECK_JS_IPC,
          (e, channel: string) => {
            const count = ipcMainListenerChannels.indexOf(channel)
            return count >= 0
          }
        )
      }
    )
  }
}
