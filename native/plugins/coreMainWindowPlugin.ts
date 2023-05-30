import { app } from 'electron'
import Core from '../core'
import useMainServer from '../hooks/useMainServer'
import useMainWindow from '../hooks/useMainWindow'
import getPort from '../utils/getPort'
import { CorePlugin } from './corePlugin'
export default class CoreMainWindowPlugin implements CorePlugin {
  name = 'core-mainWindow-plugin'

  apply($core: Core) {
    const { getMainWindow } = useMainWindow($core)
    const { createMainServer } = useMainServer($core)
    /**
     * 创建应用
     * @returns
     */
    const createElectronApp = () => {
      //todo: 监听进程错误进行
      return new Promise<void>((resolve, reject) => {
        // todo: 做一些初始化
        app.disableHardwareAcceleration()
        const gotTheLock = app.requestSingleInstanceLock()
        if (!gotTheLock) {
          $core.appQuit()
          return
        } else {
          app.on('second-instance', (event) => {
            //todo: 加个生命周期的调用
            $core.restoreMainWindow()
          })
        }

        app.on('window-all-closed', () => {
          //todo: 加个生命周期的调用
          if (process.platform !== 'darwin') {
            $core.mainLogger.log('window-all-closed quit')
            $core.appQuit()
          }
        })

        app.on('ready', async () => {
          //todo: 加个生命周期的调用
          await createMainWindow()
          app.on('activate', async () => {
            //todo: 加个生命周期的调用
            $core.restoreMainWindow()
          })
          resolve()
        })
      })
    }

    /**
     * 创建主窗口
     */
    const createMainWindow = async () => {
      const mainWindow = getMainWindow()
      $core.mainWindow = mainWindow!
      await createMainServer()
    }

    /**
     * 还原窗口
     */
    const restoreMainWindow = () => {
      if ($core.mainWindow) {
        if ($core.mainWindow.isMinimized()) $core.mainWindow.restore()
        $core.mainWindow.focus()
      }
    }

    /**
     * 退出应用
     */
    const appQuit = () => {
      //todo: 加个生命周期的调用
      app.quit()
    }

    /**
     * 重启应用
     */
    const appRelaunch = () => {
      //todo: 加个生命周期的调用
      app.relaunch()
      app.exit()
    }
    /**
     * 初始化窗口参数
     */
    $core.lifeCycle.beforeCreateMainWindow.tap(
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
    $core.lifeCycle.awaitCreateMainWindow.tapPromise(
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
          $core.appQuit = appQuit.bind($core)
          $core.appRelaunch = appRelaunch.bind($core)
          $core.restoreMainWindow = restoreMainWindow.bind($core)
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
    $core.lifeCycle.afterCreateMainWindow.tap(
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
