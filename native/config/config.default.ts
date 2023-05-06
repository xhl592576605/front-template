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
    port: 7072
  }

  return config
}
