import { ipcRenderer } from 'electron'
import { IpcMainChannel } from '../ipcChannel'

export default {
  /** 获取core的配置 */
  getCoreConfig: () => ipcRenderer.invoke(IpcMainChannel.Core.GET_CONFIG),

  /** 获取core的选项 */
  getCoreOption: () => ipcRenderer.invoke(IpcMainChannel.Core.GET_CONFIG),
  /**
   * 更改主服务的环境，会重启，指向对应的环境的web
   * @param env
   * @returns
   */
  changeMainServerEnv: (env: string) =>
    ipcRenderer.invoke(IpcMainChannel.Core.CHANGE_MAIN_SERVER_ENV, env)
}
