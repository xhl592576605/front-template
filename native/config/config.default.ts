import Core from '../core'
import { ApplicationConfig, DevelopmentMode } from '../types/config'

export default ($core: Core) => {
  const config: ApplicationConfig = {
    env: 'devp',
    developmentMode: {
      default: DevelopmentMode.vue,
      mode: {
        vue: {
          hostname: 'localhost',
          port: 8080
        },
        react: {
          hostname: 'localhost',
          port: 3000
        },
        html: {
          hostname: 'localhost',
          indexPage: 'index.html'
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
          nodeIntegration: false,
          webSecurity: false,
          allowRunningInsecureContent: true,
          contextIsolation: true
        },
        show: false,
        fullscreen: true
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
    }
  }
  config.mainServer = {
    protocol: 'http://',
    host: 'localhost',
    port: 7072,
    portRange: [7072, 7100]
  }

  return config
}
