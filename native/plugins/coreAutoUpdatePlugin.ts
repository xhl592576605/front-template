import axios from 'axios'
import { MessageBoxOptions, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import fs from 'fs-extra'
import path from 'path'
import YAML from 'yaml'
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
  constructor(isAutoUpdate = true) {
    this.isAutoUpdate = isAutoUpdate
    if (isDev()) {
      // 可以用于开发环境强制去执行检查更新逻辑
      autoUpdater.forceDevUpdateConfig = true
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
     * 检查本地是否有相同更新文件
     * @param url
     * @returns
     */

    const fetchRemoteLatest = (url: string) => {
      return axios
        .request({
          method: 'get',
          url: `${url}/latest.yml`,
          responseType: 'text'
        })
        .then((res) => {
          return YAML.parse(res.data)
        })
    }
    const getInstallPath = (version: string) => {
      const localInstallerPath = `${$core.options.userHome}/AppData/Local/${
        $core.options.appName
      }${isDev() ? '' : '-updater'}`
      const icePointInstallerBasePath = $core.config.setting?.icePointPath
        ? `${$core.config.setting?.icePointPath}/install-package`
        : ''
      const icePointInstallerPath = $core.config.setting?.icePointPath
        ? `${icePointInstallerBasePath}/${version}/${$core.options.appName}-updater`
        : ''
      return {
        localInstallerPath,
        icePointInstallerBasePath,
        icePointInstallerPath
      }
    }
    /**
     * 检查本地是否有软件包，如果没有，检查icePoint是否有软件包，如果有，复制到本地
     */
    const checkLocalUpdateFile = (url: string) => {
      return new Promise<boolean | undefined>((resolve, reject) => {
        fetchRemoteLatest(url)
          .then((remoteYml) => {
            const { version } = remoteYml
            const { localInstallerPath, icePointInstallerPath } =
              getInstallPath(version)
            return {
              remoteYml,
              localInstallerPath,
              icePointInstallerPath
            }
          })
          .then(({ remoteYml, localInstallerPath, icePointInstallerPath }) => {
            const isLocalInstallerExist = fs.existsSync(localInstallerPath)
            const isIcePointInstallerExist = fs.existsSync(
              icePointInstallerPath
            )
            if (!isLocalInstallerExist && !isIcePointInstallerExist) {
              // 本地和icePoint都没有安装包
              resolve(undefined)
              return
            }
            const remoteFileSize = remoteYml.files.find(
              (item: any) => item.url === remoteYml.path
            ).size

            if (isLocalInstallerExist) {
              // 本地有安装包,判断与云端大小一致嘛？
              const localInstallerExePath = path.join(
                localInstallerPath,
                'pending',
                remoteYml.path
              )
              const localInstallerExeSize =
                fs.statSync(localInstallerExePath)?.size || undefined
              if (remoteFileSize === localInstallerExeSize) {
                resolve(true)
                return
              }
            }
            if (isIcePointInstallerExist) {
              // icePoint有安装包,判断与云端大小一致嘛？
              const icePointInstallerExePath = path.join(
                icePointInstallerPath,
                'pending',
                remoteYml.path
              )
              const icePointInstallerExeSize =
                fs.statSync(icePointInstallerExePath)?.size || undefined
              if (remoteFileSize === icePointInstallerExeSize) {
                // 一致复制到本地
                fs.moveSync(icePointInstallerPath, localInstallerPath, {
                  overwrite: true
                })
                resolve(true)
                return
              }
            }
            resolve(undefined)
          })
          .catch(reject)
      })
    }

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
       * 1. 注册CHECK_UPDATES事件，由外部通知检查，跟检查的feedUrl
       * 2. 寻找本地是否有安装包（包含本地updater缓存文件夹，冰点还原路径下），如果有拿取版本信息行least。yml
       * 3. 根据feedUrl，去请求运行least。yml，得到版本信息
       * 4. 判断本地的版本信息与远程的版本信息，如果本地的版本信息等于远程的版本信息，并且不等于当前的版本信息，则提示用户更新，若是有其他版本则删除软件包
       * 5. 如果本地本地是否有安装包，则进行检查，检查后，有新的版本，则主动去下载
       * 6. 下载好后，通知用户安装，用户是否接受安装自行决定
       * 7. 下载好后，为了冰点问题，要copy一份到冰点目录，以免下次进来，被清理掉
       * 8. 如果用户接受安装，则安装，安装后，重启软件
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
          const { version } = info
          const {
            localInstallerPath,
            icePointInstallerBasePath,
            icePointInstallerPath
          } = getInstallPath(version)
          if (icePointInstallerBasePath) {
            // 如果启用冰点，备份到非冰点目录，更新备份信息，删除旧数据
            fs.copy(localInstallerPath, icePointInstallerPath, {
              overwrite: true,
              recursive: true
            })
            if (fs.existsSync(icePointInstallerBasePath)) {
              const files = fs.readdirSync(icePointInstallerBasePath)
              files.forEach((file) => {
                if (file !== version.toString()) {
                  fs.remove(path.join(icePointInstallerBasePath, file))
                }
              })
            }

            ;(autoUpdater.logger as any).info(
              `autoUpdater update-downloaded copy install package to icePoint path :${icePointInstallerPath}`
            )
          }
          $core.sendToIpcRenderer(
            IpcWebContentChannel.AutoUpdate.UPDATE_DOWNLOADED,
            info
          )
          $core.sendToIpcRenderer(
            IpcWebContentChannel.AutoUpdate.CAN_INSTALL_UPDATE
          )
        })
        $core.addIpcMainListener(
          IpcMainChannel.AutoUpdate.CHECK_UPDATES,
          async (e, url, desc) => {
            //* 这边是检查本地是否缓存安装包，如果没有，就去检查冰点路径下，将文件复制过去，以免待会checkForUpdates还去下载
            await checkLocalUpdateFile(url)
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
            //* 即使本地有安装包，也要去检查，因为autoUpdater内部有些变量要实例化，才能正确quitAndInstall
            autoUpdater.checkForUpdates()
          }
        )
        $core.addIpcMainListener(
          IpcMainChannel.AutoUpdate.DOWNLOAD_UPDATE,
          () => {
            return autoUpdater.downloadUpdate()
          }
        )
        $core.addIpcMainListener(
          IpcMainChannel.AutoUpdate.INSTALL_UPDATE,
          () => {
            return autoUpdater.quitAndInstall()
          }
        )
      })
    }

    $core.lifeCycle.awaitAppReady.tapPromise(this.name, async () => {
      autoUpdater.logger = $core.logger.scope('autoUpdater')
      if (this.isAutoUpdate) {
        execAutoUpdate()
        return
      }
      if ($core.options.platform !== 'win32') {
        // 手动支持只支持windows
        ;(autoUpdater.logger as any).info(
          `autoUpdater hand autoUpdate not support platform:${$core.options.platform},only support win32`
        )
        return
      }
      execNoAutoUpdate()
    })
  }
}
