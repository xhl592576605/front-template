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
      listener: (...args: any[]) => void,
      log = true
    ) => {
      ipcMainListenerChannels.push(channel)
      ipcMain.handle(channel, listener)
      log && $core.mainLogger.info(`[ipcMain] add listener: ${channel}`)
    }

    /**
     * 主进程添加一次监听
     * @param channel
     * @param listener
     */
    const addIpcMainListenerOnce = (
      channel: string,
      listener: (...args: any[]) => void,
      log = true
    ) => {
      ipcMainListenerChannels.push(channel)
      ipcMain.handleOnce(channel, (...args) => {
        // 一次性就移除channels
        ipcMainListenerChannels = ipcMainListenerChannels.filter(
          (item) => item !== channel
        )
        return listener(...args)
      })
      log && $core.mainLogger.info(`[ipcMain] add listener once: ${channel}`)
    }

    /**
     * 主进程移除监听
     * @param channel
     */
    const removeIpcMainListener = (channel: string, log = true) => {
      ipcMain.removeHandler(channel)
      ipcMainListenerChannels = ipcMainListenerChannels.filter(
        (item) => item !== channel
      )
      log && $core.mainLogger.info(`[ipcMain] remove listener : ${channel}`)
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
    /**
     * 主进程发送消息到渲染进程 没有日志，解决一些定时器一直发送，导致日志文件很大
     * @param channel
     * @param args
     */
    const sendToIpcRendererByNoLog = (channel: string, ...args: any[]) => {
      if ($core.mainWindow) {
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
        $core.sendToIpcRendererByNoLog = sendToIpcRendererByNoLog.bind($core)

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
