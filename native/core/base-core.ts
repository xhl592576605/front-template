import { ElectronLog } from 'electron-log'
import { ApplicationConfig } from '../types/config'

export default class BaseCore {
  /**
   * 定义一些虚拟方法，在对应的插件进行实现
   */

  /**
   * 配置文件
   */
  declare config: ApplicationConfig
  /**
   * 获取配置文件路径
   */
  declare getConfigFilePath: () => string
  /**
   * 更新配置文件到本地
   */
  declare updateConfigFile: () => void

  /**
   * 主进程日志记录对象
   */
  declare mainLogger: ElectronLog
  /**
   * 网络请求日志记录对象
   */
  declare netLogger: ElectronLog
  /**
   * 渲染进程日志记录对象

   */
  declare rendererLogger: ElectronLog
  /**
   * webview日志记录对象
   */
  declare webViewLogger: ElectronLog

  /**
   * 上报日志
   * @param sumbitUrl 上报地址
   * @param header 请求头
   */
  declare reportLog: (
    sumbitUrl: string,
    data: Record<string, any>,
    header?: Record<string, any>,
    options?: {
      lastest?: boolean
      day?: number
      upload?: boolean
    },
  ) => void
}
