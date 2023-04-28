import { LoadURLOptions } from 'electron'

/**
 * 应用配置
 */
export type ApplicationConfig = {
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
  logger: {
    dir: string
    main: LoggerObj
    net: LoggerObj
    renderer: LoggerObj
    webView: LoggerObj
  }
}

export type LoggerObj = {
  fileName: string
  maxSize?: number
  level?: string
  format?: string
  console?: boolean
}
export enum DevelopmentMode {
  vue = 'vue',
  react = 'react',
  html = 'html'
}
