import { contextBridge, ipcRenderer } from 'electron'
import { IpcMainChannel, IpcWebContentChannel } from './ipcChannel'
import AppIpc from './ipcMethod/appIpc'
import AutoUpdateIpc from './ipcMethod/autoUpdateIpc'
import CoreIpc from './ipcMethod/coreIpc'

/** 环境标识位 */
contextBridge.exposeInMainWorld('__ELECTRON__', true)

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
   * 移除来自主进程的特定监听
   * @param channel
   * @returns
   */
  removeEventListener: (
    channel: string,
    listener: (...args: any[]) => void
  ) => {
    ipcRenderer.removeListener(channel, listener)
  },
  /**
   * 移除来自主进程的监听
   * @param channel
   * @returns
   */
  removeEventAllListener: (channel: string) =>
    ipcRenderer.removeAllListeners(channel),

  /**
   * 发送到 host 页面上的 <webview> 元素，而不是主进程。
   * @param channel
   * @param args
   * @returns
   */
  sendToHost: (channel: string, ...args: any[]) =>
    ipcRenderer.sendToHost(channel, ...args),

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
  App: AppIpc,
  /**
   * 软件更新方法
   */
  AutoUpdate: AutoUpdateIpc
})

/**
 * 一些初始化导出的工具函数，对象，值能
 */
const initExposeUtil = async () => {
  const SoundOutputDelayTime = await ipcRenderer.invoke(
    IpcMainChannel.App.GET_SOUND_OUTPUT_DELAY_TIME
  )
  contextBridge.exposeInMainWorld('SoundOutputDelayTime', SoundOutputDelayTime)
}

initExposeUtil()
