import path from 'path'
import Core from '../core'
import { isDev, isProd } from '../ps'
import createKoaApp from '../utils/createKoaApp'

export default (core: Core) => {
  /** 根据配置创建主服务 */
  const createMainServer = () => {
    const { homeDir } = core.options
    const { remoteUrl, developmentMode } = core.config
    const { default: selectMode, mode } = developmentMode
    const modeInfo = mode[selectMode]

    let type = ''
    let url = ''

    // 远程模式
    if (remoteUrl?.enable) {
      type = 'remote_web'
      url = remoteUrl.url
      loadMainUrl(type, url)
      return
    }
    if (isProd()) {
      loadLocalWeb('html')
      return
    }
    let staticDir = undefined
    if (selectMode == 'html') {
      staticDir = path.join(homeDir, 'frontend', 'dist')
      loadLocalWeb('html', staticDir, modeInfo as any)
    }
    // 单页应用
    const protocol = modeInfo.protocol || 'http://'
    url = protocol + modeInfo.hostname + ':' + modeInfo.port
    if (isDev()) {
      loadMainUrl('spa', url)
    } else {
      loadLocalWeb('spa')
    }
  }

  /**
   * 根据类型主窗口加载url
   * @param type 类型
   * @param url 路径
   */
  const loadMainUrl = (type: string, url: string) => {
    const { mainServerEnv } = core.config
    const { options: mainServerOpt } = core.config.mainServer!
    core.mainLogger?.info(`node env:${process.env.NODE_ENV}`)
    core.mainLogger?.info(`mainServer env:${mainServerEnv},type:${type}`)
    core.mainLogger?.info(`mainServer running at ${url}`)
    core.mainWindow.loadURL(url, mainServerOpt)
  }

  const loadLocalWeb = (
    mode: string,
    staticDir?: string,
    hostInfo?: {
      protocol: string
      hostname: string
      indexPage?: string
      port: number
      ssl?: {
        key: string
        cert: string
      }
    }
  ) => {
    const { baseDir } = core.options
    if (!staticDir) {
      staticDir = path.join(baseDir, 'public', 'dist')
    }
    if (!hostInfo) {
      hostInfo = core.config.mainServer
    }
    const {
      protocol = 'http://',
      hostname = 'localhost',
      indexPage = 'index.html',
      port,
      ssl
    } = hostInfo!
    let url = `${protocol}${hostname}:${port}`
    if (mode === 'html') {
      url = `${url}/${indexPage}`
    }
    createKoaApp(staticDir, port, protocol, ssl).then(() => {
      core.mainLogger?.info(`mainServer staticDir:${staticDir}`)
      loadMainUrl(mode, url)
    })
  }

  return {
    createMainServer
  }
}
