import debug from 'debug'
import fs from 'fs'
import merge from 'lodash/merge'
import path from 'path'
import yaml from 'yaml'
import Core from '../core'
import { IpcMainChannel } from '../preload/ipcChannel'
import { CWD, isDev } from '../ps'
import { ApplicationConfig } from '../types/config'
import loadModule from '../utils/loadModule'
import { CorePlugin } from './corePlugin'
/**
 * 配置插件
 * ! 该插件需要最先加载, 以保证其他插件可以使用配置,并且要保证配置路径逻辑都要正确
 * @export
 * @class CoreConfigPlugin
 * @implements {CorePlugin}
 * @description
 * 1. 读取用户目录下的配置文件
 * 2. 读取软件目录下的配置文件
 * 3. 合并配置文件
 * 4. 保存配置文件
 */
export default class CoreConfigPlugin implements CorePlugin {
  name = 'core-config-plugin'
  private debug = debug(this.name)
  apply($core: Core) {
    const CONFIG_FILE_NAME = `.config.${$core.options.appName}.yaml`

    /**
     * 若是冰点还原，配置文件路径为软件安装目录下的统计目录，否则为用户目录下的配置文件
     * fixme: 可以应该保证冰点还原的配置路径是正确的，目前只考虑了window情况
     * @returns 配置文件路径
     */
    const getConfigFilePath = () => {
      const { userHome, execDir } = $core.options
      if (isDev()) {
        //! 开发时 配置目录改成开发目录下的.config
        const devConfigPath = path.join(CWD(), '.config')
        if (!fs.existsSync(devConfigPath)) {
          fs.mkdirSync(devConfigPath, { recursive: true })
        }
        return path.join(devConfigPath, CONFIG_FILE_NAME)
      }
      //fixme: 冰点还原默认为执行路径的上一级，也就是软件安装目录的统计目录（这边暂时不考虑除win以外的系统）
      const deepFreezeConfigPath = path.join(execDir, '../', CONFIG_FILE_NAME)
      if (fs.existsSync(deepFreezeConfigPath)) {
        return deepFreezeConfigPath
      }
      return path.join(userHome, CONFIG_FILE_NAME)
    }

    /**
     * 保存配置文件
     */
    const updateConfigFile = () => {
      const configStr = yaml.stringify($core.config)
      fs.writeFileSync(getConfigFilePath(), configStr, 'utf-8')
    }

    /**
     * 获取配置文件
     * @returns
     */
    const getConfigFileConfig = () => {
      const configPath = getConfigFilePath()
      if (!fs.existsSync(configPath)) return null
      const configStr = fs.readFileSync(configPath, 'utf-8')
      const config = yaml.parse(configStr)
      return config
    }

    /**
     * 获取内置文件
     * @returns
     */
    const getInnerConfig = () => {
      const { env, baseDir } = $core.options

      // 1. 获取内置默认配置文件
      const defaultConfig =
        loadModule(path.join(baseDir, 'config/config.default.js'), $core) || {}

      // 2. 获取内置环境配置文件
      const envConfig = loadModule(
        path.join(baseDir, `config/config.${env}.js`)
      )
      merge(defaultConfig, envConfig || {})
      return defaultConfig
    }

    $core.lifeCycle.awaitGetConfig.tapPromise(this.name, async () => {
      /**
       * 获取内存配置
       * 读取本地配置
       * 合并
       * 给core对象动态加函数
       */

      try {
        if (!$core.config) {
          $core.config = {} as ApplicationConfig
        }
        const { isPackaged } = $core.options
        const innerConfig = getInnerConfig()
        if (isPackaged) {
          const fileConfig = getConfigFileConfig()
          merge($core.config, innerConfig, fileConfig)
        } else {
          merge($core.config, innerConfig)
        }
        this.debug('config:%j', $core.config)

        const { env } = process
        env.ELECTRON_MAIN_SERVER_ENV = $core.config.mainServerEnv

        $core.updateConfigFile = updateConfigFile.bind($core)
        $core.getConfigFilePath = getConfigFilePath.bind($core)
      } catch (e: any) {
        this.debug('awaitGetConfig:%j', e.message)
      }
    })
    $core.lifeCycle.afterGetConfig.tap(this.name, () => {
      // 更新配置文件
      updateConfigFile()
    })

    $core.lifeCycle.afterCreateMainWindow.tap(this.name, async () => {
      $core.addIpcMainListener(IpcMainChannel.Core.GET_CONFIG, async () => {
        return $core.config
      })
    })
  }
}
