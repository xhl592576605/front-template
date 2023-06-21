import { BrowserWindowConstructorOptions, LoadURLOptions } from 'electron'
import { LevelOption } from 'electron-log'

/**
 * 应用配置
 * @param developmentMode 开发模式
 * @param mainServer 主服务
 *  - protocol 协议
 *  - host 主机
 *  - port 端口
 *  - portRange 端口范围
 *  - ssl ssl证书
 *  - options 加载url的参数
 * @param mainServerEnv 主服务环境
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
  developmentMode: {
    default: DevelopmentMode
    mode: {
      [key in DevelopmentMode]: {
        protocol?: string
        hostname: string
        indexPage?: string
        port: number
      }
    }
  }
  mainServer?: {
    protocol: string
    hostname: string
    port: number
    portRange?: [number, number]
    ssl?: {
      key: string
      cert: string
    }
    staticDir?: string
    options?: LoadURLOptions
  }
  mainServerEnv:
    | 'dev'
    | 'devp'
    | 'develop'
    | 'development'
    | 'test'
    | 'pre'
    | 'prod'
    | 'production'
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
    fileName: string
    maxSize?: number
    level?: LevelOption
    format?: string
    console?: boolean
  }
  preloadPath: string
}

export enum DevelopmentMode {
  vue = 'vue',
  react = 'react',
  html = 'html'
}
