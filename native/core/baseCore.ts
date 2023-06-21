import { ElectronLog, LogFunctions } from 'electron-log'
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

  /** 还原窗口 */
  declare restoreMainWindow: () => void

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
}
