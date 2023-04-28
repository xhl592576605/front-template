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
      main: {
        fileName: 'main.log'
      },
      net: {
        fileName: 'net.log'
      },
      renderer: {
        fileName: 'renderer.log'
      },
      webView: {
        fileName: 'webView.log'
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
