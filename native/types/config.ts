import { BrowserWindowConstructorOptions, LoadURLOptions } from 'electron'
import { LevelOption } from 'electron-log'

/**
 * 应用配置
 * @param env 运行环境
 * @param developmentMode 开发模式
 * @param mainServer 主服务
 *  - protocol 协议
 *  - host 主机
 *  - port 端口
 *  - portRange 端口范围
 *  - ssl ssl证书
 *  - options 加载url的参数
 * @param remoteUrl 远程地址
 *  - enable 是否启用
 *  - url 远程地址
 *  - options 加载url的参数
 * @param windowsOption 窗口参数
 * @param logger 日志
 *  - dir 日志目录
 *  - log 日志
 *   - main 主进程日志
 *   - net 网络请求日志
 *   - renderer 渲染进程日志
 *   - webView webview日志
 */
export interface ApplicationConfig {
  env: 'devp' | 'test' | 'pre' | 'prod'
  developmentMode: {
    default: DevelopmentMode
    mode: {
      [key in DevelopmentMode]: {
        protocol?: string
        hostname: string
        indexPage?: string
        port?: number
      }
    }
  }
  mainServer?: {
    protocol?: string
    host: string
    port?: number
    portRange?: [number, number]
    ssl?: {
      key: string
      cert: string
    }
    options?: LoadURLOptions
  }
  remoteUrl?: {
    enable?: boolean
    url: string
  }
  mainWindow: {
    option: BrowserWindowConstructorOptions
    openDevTools: boolean
    openAppMenu: boolean
  }
  logger: {
    dir: string
    log: {
      main: LoggerOption
      net: LoggerOption
      renderer: LoggerOption
      webView: LoggerOption
    }
  }
}

export type LoggerOption = {
  fileName: string
  maxSize?: number
  level?: LevelOption
  format?: string
  console?: boolean
}

export enum DevelopmentMode {
  vue = 'vue',
  react = 'react',
  html = 'html'
}
