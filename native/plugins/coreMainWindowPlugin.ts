import { app } from 'electron'
import Core from '../core'
import useMainServer from '../hooks/useMainServer'
import useMainWindow from '../hooks/useMainWindow'
import useWebRequest from '../hooks/useWebRequest'
import getPort from '../utils/getPort'
import { CorePlugin } from './corePlugin'
export default class CoreMainWindowPlugin implements CorePlugin {
  name = 'core-mainWindow-plugin'

  apply($core: Core) {
    const { getMainWindow } = useMainWindow($core)
    const { createMainServer } = useMainServer($core)
    const { registerWebRequestIntercept } = useWebRequest($core)

    /**
     * 创建应用
     * @returns
     */
    const createElectronApp = () => {
      return new Promise<void>((resolve, reject) => {
        $core.mainLogger.info(`$core ${this.name} createElectronApp called`)
        try {
          app.disableHardwareAcceleration()
          const gotTheLock = app.requestSingleInstanceLock()
          if (!gotTheLock) {
            $core.appQuit()
            return
          } else {
            app.on('second-instance', async (event) => {
              $core.mainLogger.log('app second-instance')
              await $core.lifeCycle.awaitAppSecondInstance.promise($core, event)
              $core.restoreMainWindow()
            })
          }

          app.on('window-all-closed', async () => {
            $core.mainLogger.log('app window-all-closed')
            await $core.lifeCycle.awaitAppWindowAllClosed.promise($core)
            if (process.platform !== 'darwin') {
              $core.mainLogger.log('window-all-closed quit')
              $core.appQuit()
            }
          })

          app.on('ready', async (event, launchInfo) => {
            await $core.lifeCycle.awaitAppReady.promise(
              $core,
              event,
              launchInfo
            )
            await createMainWindow()
            app.on('activate', async (event, hasVisibleWindows) => {
              await $core.lifeCycle.awaitAppActivate.promise(
                $core,
                event,
                hasVisibleWindows
              )
              $core.restoreMainWindow()
            })
            resolve()
          })
        } catch (e) {
          reject(e)
        }
      })
        .then(() =>
          $core.mainLogger.info(
            `$core ${this.name} createElectronApp called successfully`
          )
        )
        .catch((e) => {
          throw e
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
     * 退出应用
     */
    const appQuit = () => {
      $core.lifeCycle.beforeAppQuit.call($core)
      $core.mainLogger.info('app quit')
      app.quit()
    }

    /**
     * 重启应用
     */
    const appRelaunch = () => {
      $core.lifeCycle.beforeAppRelaunch.call($core)
      $core.mainLogger.info('app relaunch')
      app.relaunch()
      app.exit()
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
     * 切换主服务页面环境
     * @param env
     */
    const changeMainServerEnv = (
      env:
        | 'dev'
        | 'devp'
        | 'develop'
        | 'development'
        | 'test'
        | 'pre'
        | 'prod'
        | 'production'
    ) => {
      $core.config.mainServerEnv = env
      $core.updateConfigFile()
      $core.appRelaunch()
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
          await createElectronApp()
          registerWebRequestIntercept()
          $core.appQuit = appQuit.bind($core)
          $core.appRelaunch = appRelaunch.bind($core)
          $core.restoreMainWindow = restoreMainWindow.bind($core)
          $core.changeMainServerEnv = changeMainServerEnv.bind($core)
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
