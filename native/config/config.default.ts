import { ApplicationConfig, DevelopmentMode } from '../types/config'

export default () => {
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
    }
  }

  config.mainServer = {
    protocol: 'http://',
    host: 'localhost',
    port: 7072
  }

  return config
}
