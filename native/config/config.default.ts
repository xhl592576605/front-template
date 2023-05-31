import path from 'path'
import Core from '../core'
import { ApplicationConfig, DevelopmentMode } from '../types/config'

export default ($core: Core) => {
  const preloadPath = path.join($core.options.baseDir, 'preload/index.js')

  const config: ApplicationConfig = {
    env: 'devp',
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
      log: {
        main: {
          fileName: 'main.log',
          level: 'info'
        },
        net: {
          fileName: 'net.log',
          level: 'info'
        },
        renderer: {
          fileName: 'renderer.log',
          level: 'info'
        },
        webView: {
          fileName: 'webView.log',
          level: 'info'
        }
      }
    },
    preloadPath
  }
  config.mainServer = {
    protocol: 'http://',
    hostname: 'localhost',
    port: 7072,
    portRange: [7072, 7100]
  }

  return config
}
