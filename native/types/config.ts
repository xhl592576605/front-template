import { LoadURLOptions } from 'electron'

export type AppConfig = {
  homeDir: string
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
}

export enum DevelopmentMode {
  vue = 'vue',
  react = 'react',
  html = 'html'
}
