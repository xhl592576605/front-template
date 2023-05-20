import { app } from 'electron'
import Core from '../core'
import getPort from '../utils/get-port'
import { CorePlugin } from './core-plugin'
export default class CoreMainWindowPlugin implements CorePlugin {
  name = 'core-mainWindow-plugin'

  apply($core: Core) {
    /**
     * 创建应用
     * @returns
     */
    const createElectronApp = () => {
      //todo: 监听进程错误进行
      return new Promise<void>((resolve, reject) => {
        // todo: 做一些初始化
        const gotTheLock = app.requestSingleInstanceLock()
        if (!gotTheLock) {
          $core.quit()
          return
        } else {
          app.on('second-instance', (event) => {})
        }
        app.disableHardwareAcceleration()
        app.on('ready', async () => {
          await createMainWindow()
          resolve()
        })
      })
    }

    /**
     * 创建主窗口
     */
    const createMainWindow = async () => {}
    /**
     * 初始化窗口参数
     */
    $core.hooks.beforeCreateMainWindow.tap(
      {
        name: this.name,
        stage: -1
      },
      () => {
        $core.mainLogger.info(
          `$core ${this.name} beforeCreateMainWindow called successfully`
        )
      }
    )

    /**
     * 根据配置，创建窗口，并将本地web启动起来
     */
    $core.hooks.awaitCreateMainWindow.tapPromise(
      {
        name: this.name,
        stage: -1
      },
      async () => {
        /**
         * 1. 根据配置 获取端口
         * 2. 启动本地web服务
         * 3. 创建窗口
         * 4. 窗口加载本地web服务
         */
        try {
          let { port, portRange } = $core.config.mainServer!
          const _port = await getPort(port!, portRange)
          $core.mainLogger.info('$core.config.mainServer 获取到的端口', _port)
          createElectronApp()
          $core.mainLogger.info(
            `$core ${this.name} awaitCreateMainWindow called successfully`
          )
        } catch (e) {
          $core.mainLogger.error(
            `$core ${this.name} awaitCreateMainWindow called failed`,
            e
          )
        }
      }
    )

    /**
     * 最后更新下配置文件到本地
     */
    $core.hooks.afterCreateMainWindow.tap(
      {
        name: this.name,
        stage: 9999
      },
      () => {
        $core.mainLogger.info('客户端启动配置', $core.config)
        $core.updateConfigFile()
        $core.mainLogger.info(
          `$core ${this.name} afterCreateMainWindow called successfully`
        )
      }
    )
  }
}
