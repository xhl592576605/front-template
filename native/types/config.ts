import { LoadURLOptions } from 'electron'
import { LevelOption } from 'electron-log'

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
