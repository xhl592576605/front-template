import { MessageBoxOptions, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import Core from '../core'
import { IpcMainChannel, IpcWebContentChannel } from '../preload/ipcChannel'
import { isDev } from '../ps'
import { CorePlugin } from './corePlugin'

/**
 * mac 更新需要签名，暂时不考虑 要么代码签名，要么给用户一个更新地址，自行下载，覆盖安装
 */
export default class CoreAutoUpdatePlugin implements CorePlugin {
  name = 'core-auto-update-plugin'
  isAutoUpdate: boolean // 是否自动更新
  constructor(isAutoUpdate: boolean = true) {
    this.isAutoUpdate = isAutoUpdate
    if (isDev()) {
      // 可以用于开发环境强制去执行检查更新逻辑
      autoUpdater.forceDevUpdateConfig = false
    }
  }
  apply($core: Core) {
    $core.lifeCycle.afterCreateMainWindow.tap(this.name, async () => {
      autoUpdater.on('error', (error) => {
        ;(autoUpdater.logger as any).error('autoUpdater error', error)
        $core.sendToIpcRenderer(IpcWebContentChannel.AutoUpdate.ERROR, error)
      })
      autoUpdater.on('checking-for-update', () => {
        ;(autoUpdater.logger as any).info('autoUpdater checking-for-update')
        $core.sendToIpcRenderer(
          IpcWebContentChannel.AutoUpdate.CHECKING_FOR_UPDATE
        )
      })
      autoUpdater.on('update-available', (info) => {
        ;(autoUpdater.logger as any).info('autoUpdater update-available', info)
        $core.sendToIpcRenderer(
          IpcWebContentChannel.AutoUpdate.UPDATE_AVAILABLE,
          info
        )
      })
      autoUpdater.on('update-not-available', (info) => {
        ;(autoUpdater.logger as any).info(
          'autoUpdater update-not-available',
          info
        )
        $core.sendToIpcRenderer(
          IpcWebContentChannel.AutoUpdate.UPDATE_NOT_AVAILABLE,
          info
        )
      })
      autoUpdater.on('download-progress', (progressObj) => {
        ;(autoUpdater.logger as any).info(
          'autoUpdater download-progress',
          progressObj
        )
        $core.sendToIpcRenderer(
          IpcWebContentChannel.AutoUpdate.DOWNLOAD_PROGRESS,
          progressObj
        )
      })
    })

    /**
     * 执行自动更新的逻辑
     */
    const execAutoUpdate = () => {
      const config = $core.config
      const { autoUpdate: autoUpdateOpt } = config
      if (!autoUpdateOpt) {
        return
      }
      autoUpdater.setFeedURL(autoUpdateOpt.url)
      autoUpdater.on('update-downloaded', (info) => {
        const dialogOpts: MessageBoxOptions = {
          type: 'info',
          buttons: ['重启软件', '稍后再说'],
          title: '在线升级',
          message:
            (info.releaseNotes as string) ||
            '发现了新的应用版本，重启软件以应用更新',
          detail: '发现了新的应用版本，重启软件以应用更新'
        }
        dialog
          .showMessageBox(dialogOpts)
          .then((returnValue: { response: number }) => {
            if (returnValue.response === 0) {
              autoUpdater.quitAndInstall()
            }
          })
      })
      autoUpdater.checkForUpdates()
    }

    /**
     * 执行手动更新的逻辑
     */
    const execNoAutoUpdate = () => {
      /**
       * 1. 注册事件，由外部通知检查，跟检查的feedUrl
       * 2. 判断本地（包含本地，与非冰点）是否已经有下载好的软件包，如果有，通知用户安装
       * 3. 如果本地有，但是不全，并且本地的版本与当前需要更新的版本一致，则继续下载
       * 4. 如果本地有，但是不全，并且本地的版本与当前需要更新的版本不一致，则删除本地的，重新进行检查
       * 5. 如果本地没有，则开始进行检查，检查后，有新的版本，则主动去下载
       * 6. 下载好后，通知用户安装，用户是否接受安装自行决定
       * 7. 下载好后，为了冰点问题，要copy一份到非冰点目录，以免下次进来，被清理掉
       */
      autoUpdater.autoDownload = false // 不自动下载
      autoUpdater.autoInstallOnAppQuit = false // 不自动安装
      autoUpdater.allowDowngrade = true // 允许降级
      $core.lifeCycle.afterCreateMainWindow.tap(this.name, async () => {
        autoUpdater.on('update-cancelled', (info) => {
          ;(autoUpdater.logger as any).info(
            'autoUpdater update-cancelled',
            info
          )
          $core.sendToIpcRenderer(
            IpcWebContentChannel.AutoUpdate.UPDATE_CANCELLED,
            info
          )
        })
        autoUpdater.on('update-downloaded', (info) => {
          ;(autoUpdater.logger as any).info(
            'autoUpdater update-downloaded',
            info
          )
          //todo:备份到非冰点目录，更新备份信息
          $core.sendToIpcRenderer(
            IpcWebContentChannel.AutoUpdate.UPDATE_DOWNLOADED,
            info
          )
        })
        $core.addIpcMainListener(
          IpcMainChannel.AutoUpdate.CHECK_UPDATES,
          (url, desc) => {
            /**
             * 1.检查本地是否安装包，是否跟需要更新的版本一致
             * 2.如果有，判断是否完整，如果完整，则通知用户安装
             * 3.如果不完整，则走检查更新网站的逻辑，下载好，下次进来，再通知用户安装
             * 4.如果没有，则走检查更新网站的逻辑，下载好，下次进来，再通知用户安装
             */
            if ($core.config.autoUpdate) {
              $core.config.autoUpdate.url = url
              $core.updateConfigFile()
            }
            ;(autoUpdater.logger as any).info(
              'autoUpdater checkForUpdates',
              url,
              desc
            )
            autoUpdater.setFeedURL(url)
            autoUpdater.checkForUpdates()
          }
        )
        $core.addIpcMainListener(
          IpcMainChannel.AutoUpdate.DOWNLOAD_UPDATE,
          autoUpdater.downloadUpdate
        )
        $core.addIpcMainListener(
          IpcMainChannel.AutoUpdate.INSTALL_UPDATE,
          autoUpdater.quitAndInstall
        )
      })
    }

    $core.lifeCycle.awaitAppReady.tapPromise(this.name, async () => {
      autoUpdater.logger = $core.logger.scope('autoUpdater')
      if (this.isAutoUpdate) {
        execAutoUpdate()
        return
      }
      execNoAutoUpdate()
    })
  }
}
