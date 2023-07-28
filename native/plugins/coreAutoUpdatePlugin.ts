import { MessageBoxOptions, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import Core from '../core'
import { IpcWebContentChannel } from '../preload/ipcChannel'
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
      autoUpdater.forceDevUpdateConfig = true
    }
    if (!this.isAutoUpdate) {
      autoUpdater.autoDownload = false
      autoUpdater.autoInstallOnAppQuit = false
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

    $core.lifeCycle.awaitAppReady.tapPromise(this.name, async () => {
      autoUpdater.logger = $core.logger.scope('autoUpdater')
      if (this.isAutoUpdate) {
        execAutoUpdate()
        return
      }
    })
  }
}
