import path from 'path'
import Core from '../core'
import { isDev, isProd } from '../ps'
import createKoaApp from '../utils/createKoaApp'

export default (core: Core) => {
  /** 根据配置创建主服务 */
  const createMainServer = () => {
    if (core.mainServer) {
      core.mainServer.close()
      core.mainServer = null
    }
    const { homeDir } = core.options
    const { remoteUrl, developmentMode, mainServer } = core.config
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
    // node生产环境
    if (isProd()) {
      loadLocalWeb('html')
      return
    }
    // node开发环境
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

  /**
   * 根据静态目录启动一个静态资源服务器
   * @param mode
   * @param staticDir
   * @param hostInfo
   */
  const loadLocalWeb = (
    mode: string,
    staticDir?: string,
    hostInfo?: {
      staticDir?: string
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
      // 如果没有给 默认拿项目运行目录下的public/dist
      staticDir = path.join(baseDir, 'public', 'dist')
    }
    const { mainServer, mainServerEnv } = core.config
    if (!hostInfo) {
      hostInfo = mainServer
    }
    if (hostInfo?.staticDir) {
      // 如果有说 主服务指定哪个静态文件夹，就用该静态文件夹，这个可以将主服务剥离asar出来
      staticDir = path.join(hostInfo.staticDir, mainServerEnv)
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
    createKoaApp(staticDir, port, protocol, ssl).then(({ server }) => {
      core.mainServer = server
      core.mainLogger?.info(`mainServer staticDir:${staticDir}`)
      loadMainUrl(mode, url)
    })
  }

  return {
    createMainServer
  }
}
