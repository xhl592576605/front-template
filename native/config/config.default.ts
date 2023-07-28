import path from 'path'
import Core from '../core'
import { SOURCE_CODE_DIR_NAME } from '../ps'
import { ApplicationConfig, DevelopmentMode } from '../types/config'

export default ($core: Core) => {
  const basePreloadPath = path.join($core.options.baseDir, 'preload/index.js')
  const preloadPath = !$core.options.isPackaged
    ? basePreloadPath
    : path.join(
        $core.options.homeDir,
        `${SOURCE_CODE_DIR_NAME}/preload/index.js`
      )
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
          nodeIntegration: true, // Most NODE_OPTIONs are not supported in packaged apps. See documentation for more details.
          preload: path.join($core.options.baseDir, 'preload/index.js'),
          webviewTag: true
        },
        show: false // * 后续如果一启动要显示窗口，可以改为true
      },
      openDevTools: true,
      openAppMenu: true
    },
    logger: {
      dir: $core.options.logs,
      fileName: 'main.log',
      level: 'info'
    },
    preloadPath,
    autoUpdate: {
      provider: 'generic',
      url: 'http://127.0.0.1:8080'
    }
  }

  return config
}
