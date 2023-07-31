import { ElectronLog, LogFunctions } from 'electron-log'
import { Server as HttpServer } from 'http'
import { Server as HttpsServer } from 'https'
import { ApplicationConfig } from '../types/config'
export default class BaseCore {
  /**
   * 定义一些虚拟方法，在对应的插件进行实现
   */

  /** 配置文件 */
  declare config: ApplicationConfig
  /** 获取配置文件路径  */
  declare getConfigFilePath: () => string
  /** 更新配置文件到本地 */
  declare updateConfigFile: () => void
  /** 将配置文件移到安装目录底下，适用于windows */
  declare moveConfigFileToDeepFreezePath: () => void

  /** 日志记录对象 */
  declare logger: ElectronLog
  /** 主进程日志记录对象 */
  declare mainLogger: LogFunctions
  /** 网络请求日志记录对象 */
  declare netLogger: LogFunctions
  /** 渲染进程日志记录对象 */
  declare rendererLogger: LogFunctions
  /** webview日志记录对象 */
  declare webViewLogger: LogFunctions

  /** 获取当前存放日志的文件夹 */
  declare getLogPath: () => string
  /** 将当前存放的日志文件夹移到指定位置，需要重新启动 */
  declare moveLogFiles: (destPath: string) => void

  /**
   * 上报日志
   * @param submitUrl 上报地址
   * @param header 请求头
   */
  declare reportLog: (
    submitUrl: string,
    data: Record<string, any>,
    header?: Record<string, any>,
    options?: {
      latest?: boolean
      day?: number
      upload?: boolean
    }
  ) => void

  /** 执行webview的日志记录 */
  declare execWebViewLog: (level: number, message: string) => void

  /** 主窗口 */
  declare mainWindow: Electron.BrowserWindow

  /** 应用退出 */
  declare appQuit: () => void

  /** 应用重启 */
  declare appRelaunch: () => void

  /** 关闭软件 */
  declare appClose: () => void

  /** 还原窗口 */
  declare restoreMainWindow: () => void

  /** 窗口最大化 */
  declare maximize: () => void

  /** 窗口最小化 */
  declare minimize: () => void

  /** 窗口全屏 */
  declare fullScreen: (isFullScreen: boolean) => void

  /** 切换主服务页面环境 */
  declare changeMainServerEnv: (
    env:
      | 'dev'
      | 'devp'
      | 'develop'
      | 'development'
      | 'test'
      | 'pre'
      | 'prod'
      | 'production'
  ) => void

  declare mainServer: HttpServer | HttpsServer | null

  declare addIpcMainListener: (
    channel: string,
    listener: (...args: any[]) => void
  ) => void

  declare addIpcMainListenerOnce: (
    channel: string,
    listener: (...args: any[]) => void
  ) => void

  declare removeIpcMainListener: (channel: string) => void

  declare sendToIpcRenderer: (channel: string, ...args: any[]) => void
}
