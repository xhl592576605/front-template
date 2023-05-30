import path from 'path'
import Core from '../core'
import { isDev } from '../ps'
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
    let staticDir = undefined

    // html模式
    if (selectMode == 'html') {
      if (isDev()) {
        staticDir = path.join(homeDir, 'frontend', 'dist')
        loadLocalWeb('html', staticDir, modeInfo as any)
        return
      }
      loadLocalWeb('html')
      return
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
    const { env: mainEnv } = core.config
    const { options: mainServerOpt } = core.config.mainServer!
    core.mainLogger?.info(`mainServer env:${mainEnv},type:${type}`)
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
    }
  ) => {
    const { homeDir } = core.options
    if (!staticDir) {
      staticDir = path.join(homeDir, 'public', 'dist')
    }
    if (hostInfo) {
      hostInfo = core.config.mainServer
    }
    const { protocol, hostname, indexPage, port } = hostInfo!
    let url = `${protocol}${hostname}:${port}`
    if (mode === 'html') {
      url = `${url}/${indexPage || 'index.html'}`
    }
    createKoaApp(staticDir, port, protocol).then(() => {
      loadMainUrl(mode, url)
    })
  }

  return {
    createMainServer
  }
}
