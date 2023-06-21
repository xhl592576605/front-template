import path from 'path'
import Core from '../core'
import { ApplicationConfig, DevelopmentMode } from '../types/config'

export default ($core: Core) => {
  const preloadPath = path.join($core.options.baseDir, 'preload/index.js')

  const config: ApplicationConfig = {
    developmentMode: {
      default: DevelopmentMode.html,
      mode: {
        vue: {
          hostname: 'localhost',
          port: 3000
        },
        react: {
          hostname: 'localhost',
          port: 8080
        },
        html: {
          hostname: 'localhost',
          indexPage: 'index.html',
          port: 3000
        }
      }
    },
    mainServer: {
      protocol: 'http://',
      hostname: 'localhost',
      port: 7072,
      portRange: [7072, 7100]
    },
    mainServerEnv: 'prod',
    mainWindow: {
      option: {
        title: $core.options.appName,
        width: 980,
        height: 650,
        minWidth: 800,
        minHeight: 650,
        webPreferences: {
          // nodeIntegration:true, Most NODE_OPTIONs are not supported in packaged apps. See documentation for more details.
          preload: preloadPath,
          webviewTag: true
        },
        show: true
      },
      openDevTools: true,
      openAppMenu: true
    },
    logger: {
      dir: $core.options.logs,
      fileName: 'main.log',
      level: 'info'
    },
    preloadPath
  }

  return config
}
