import { contextBridge, ipcRenderer } from 'electron'
import { IpcMainChannel, IpcWebContentChannel } from './ipcChannel'
import AppIpc from './ipcMethod/appIpc'
import CoreIpc from './ipcMethod/coreIpc'

/**
 * 为渲染进程提供的api，可以在渲染进程中使用，若是模块提供的方法可以像Core，App一样添加
 */
contextBridge.exposeInMainWorld('Electron', {
  /**
   * 检查主进程是否注册了某个channel
   * @param channel
   * @returns
   */
  checkJsIpc: (channel: string) =>
    ipcRenderer.invoke(IpcMainChannel.CHECK_JS_IPC, channel),
  /**
   * 注册来自主进程的监听
   * @param channel
   * @param listener
   * @returns
   */
  addEventListener: (channel: string, listener: (...args: any[]) => void) =>
    ipcRenderer.on(channel, listener),
  /**
   * 移除来自主进程的监听
   * @param channel
   * @returns
   */
  removeEventListener: (channel: string) =>
    ipcRenderer.removeAllListeners(channel),
  /**
   * 主进程的监听事件
   */
  IpcMainChannel,
  /**
   * 主进程发送到渲染进程的事件
   */
  IpcWebContentChannel,
  /**
   * 核心方法
   */
  Core: CoreIpc,
  /**
   * APP方法
   */
  App: AppIpc
})
