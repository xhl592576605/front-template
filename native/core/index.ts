import path from 'path'
import getPort from 'get-port'
import { app, BrowserWindow, dialog } from 'electron'
import Koa from 'koa'
import koaServe from 'koa-static'
import { AppConfig } from '../types/config'
import createDefaultConfig from '../config/config.default'
import MainWindow from '../main-window'
import assert from 'assert'
import fs from 'fs'
import https from 'https'

class Core {
  config: AppConfig
  option: Record<string, any>
  mainWindow: BrowserWindow | undefined
  constructor() {
    this.option = this.createOption()
    this.config = createDefaultConfig(this)

    this.initialize()
  }

  initialize() {
    return Promise.resolve()
      .then(() => this.createPorts())
      .then(() => this.createElectronApp())
  }
  createOption() {
    return {
      baseDir: path.join(app.getAppPath(), 'native'),
      homeDir: app.isPackaged
        ? path.join(app.getAppPath(), 'out')
        : app.getAppPath(),
      appName: app.getName(),
      userHome: app.getPath('home'),
      appData: app.getPath('appData'),
      appUserData: app.getPath('userData'),
      appVersion: app.getVersion(),
      isPackaged: app.isPackaged,
      execDir: app.getAppPath()
    }
  }

  createPorts() {
    return new Promise((resolve, reject) => {
      getPort({ port: this.config.mainServer?.port })
        .then((mainPort) => {
          this.config.mainServer!.port = mainPort
        })
        .then(resolve)
        .catch(reject)
    })
  }

  createElectronApp() {
    return new Promise<void>(() => {
      const gotTheLock = app.requestSingleInstanceLock()
      if (!gotTheLock) {
        app.quit()
        return
      }
      app.whenReady().then(() => {
        this.createWindow()
      })

      app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
          app.quit()
        }
      })
    })
  }

  createWindow() {
    this.mainWindow = MainWindow.getMainWindow()
    this.selectAppType()
  }

  /**
   * 应用类型 （远程、html、单页应用）
   */
  selectAppType() {
    let type = ''
    let url = ''

    // 远程模式
    const remoteConfig = this.config.remoteUrl
    if (remoteConfig?.enable == true) {
      type = 'remote_web'
      url = remoteConfig.url
      this.loadMainUrl(type, url)
      return
    }

    const developmentModeConfig = this.config.developmentMode
    const selectMode = developmentModeConfig.default
    const modeInfo = developmentModeConfig.mode[selectMode]
    let staticDir = undefined

    // html模式
    if (selectMode == 'html') {
      if (process.env.NODE_ENV === 'development') {
        staticDir = path.join(this.config.homeDir, 'frontend', 'dist')
      }
      this.loadLocalWeb('html', staticDir, modeInfo)
      return
    }

    // 单页应用
    const protocol = modeInfo.protocol || 'http://'
    url = protocol + modeInfo.hostname + ':' + modeInfo.port
    if (process.env.NODE_ENV === 'development') {
      this.loadMainUrl('spa', url)
    } else {
      this.loadLocalWeb('spa')
    }
  }

  loadMainUrl(type: string, url: string) {
    const mainServer = this.config.mainServer

    this.mainWindow!.loadURL(url, mainServer!.options || {})
  }

  loadLocalWeb(mode: string, staticDir?: string, hostInfo?: any) {
    if (!staticDir) {
      staticDir = path.join(this.config.homeDir, 'public', 'dist')
    }
    dialog.showMessageBox(this.mainWindow!, {
      message: this.config.homeDir
    })

    const koaApp = new Koa()
    koaApp.use(koaServe(staticDir))

    const mainServer = this.config.mainServer!
    let url = mainServer.protocol + mainServer.host + ':' + mainServer.port
    if (mode == 'html') {
      url += '/' + hostInfo.indexPage
    }

    const isHttps = mainServer.protocol == 'https://' ? true : false
    if (isHttps) {
      const keyFile = path.join(this.config.homeDir, mainServer.ssl!.key)
      const certFile = path.join(this.config.homeDir, mainServer.ssl!.cert)
      assert(fs.existsSync(keyFile), 'ssl key file is required')
      assert(fs.existsSync(certFile), 'ssl cert file is required')

      const sslOpt = {
        key: fs.readFileSync(keyFile),
        cert: fs.readFileSync(certFile)
      }
      https
        .createServer(sslOpt, koaApp.callback())
        .listen(mainServer.port, () => {
          this.loadMainUrl(mode, url)
        })
    } else {
      koaApp.listen(mainServer.port, () => {
        this.loadMainUrl(mode, url)
      })
    }
  }
}

export default Core
