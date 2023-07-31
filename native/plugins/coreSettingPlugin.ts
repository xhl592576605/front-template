import Core from 'native/core'
import { IpcMainChannel } from '../preload/ipcChannel'
import { ApplicationSetting } from '../types/config'
import { CorePlugin } from './corePlugin'

/**
 * ! 软件设置，初步设置为一定要重新启动软件，不然一些设置不生效,启动由上层应用手动触发
 */
export default class CoreSettingPlugin implements CorePlugin {
  name = 'core-setting-plugin'
  apply($core: Core) {
    /**
     * 更改冰点路径
     * 1. 配置文件，删除默认位置， 移到新的安装目录下
     * 2. 日志文件一指冰点目录
     * @param oldIcePointPath
     * @param icePointPath
     */
    const changeIcoPointPath = (
      oldIcePointPath: string | undefined,
      icePointPath: string
    ) => {
      if (!oldIcePointPath) {
        // * 如果没有旧的冰点还原，代表是初次设置，需要移动配置配置文件
        $core.moveConfigFileToDeepFreezePath()
      }
      $core.moveLogFiles(icePointPath)
    }

    $core.lifeCycle.afterCreateMainWindow.tap(this.name, () => {
      $core.addIpcMainListener(IpcMainChannel.App.GET_SETTING, () => {
        return $core.config?.setting
      })

      $core.addIpcMainListener(
        IpcMainChannel.App.CHANGE_SETTING,
        (e, setting: ApplicationSetting = {}) => {
          const { icePointPath: oldIcePointPath } = $core.config?.setting || {}
          const { icePointPath } = setting

          if (
            (!oldIcePointPath && icePointPath) ||
            (icePointPath &&
              oldIcePointPath &&
              icePointPath !== oldIcePointPath)
          ) {
            $core.mainLogger.info(
              `change ice point path: old:${oldIcePointPath};new:${icePointPath}`
            )
            changeIcoPointPath(oldIcePointPath, icePointPath)
          }
          $core.config.setting = {
            ...($core.config.setting || {}),
            ...setting
          }
          $core.mainLogger.info('change setting', $core.config.setting)
          $core.updateConfigFile()
        }
      )

      $core.addIpcMainListener(
        IpcMainChannel.App.GET_SOUND_OUTPUT_DELAY_TIME,
        () => {
          return $core.config?.setting?.soundOutputDelayTime || 0
        }
      )
    })
  }
}
