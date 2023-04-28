import fs from 'fs'
import path from 'path'
import yaml from 'yaml'
import debug from 'debug'
import merge from 'lodash/merge'
import Core from '../core'
import { CorePlugin } from './core-plugin'
import { ApplicationConfig } from '../types/config'
import loadModule from '../utils/load-module'
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
     * 若是用户目录存在配置文件，则使用用户目录的配置文件，否则使用如软件统计目录的配置文件
     * fixme: 可以应该保证冰点还原的配置路径是正确的
     * @returns 配置文件路径
     */
    const getConfigFilePath = () => {
      const { userHome, baseDir } = $core.options
      if (fs.existsSync(path.join(baseDir, CONFIG_FILE_NAME))) {
        return path.join(baseDir, CONFIG_FILE_NAME)
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
      // todo: 如何调试 如何让读取app.asar内部文件

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

    $core.hooks.awaitGetConfig.tapPromise(this.name, async () => {
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

        $core.updateConfigFile = updateConfigFile.bind($core)
        $core.getConfigFilePath = getConfigFilePath.bind($core)
      } catch (e: any) {
        this.debug('awaitGetConfig:%j', e.message)
      }
    })
    $core.hooks.afterGetConfig.tap(this.name, () => {
      // 更新配置文件
      updateConfigFile()
    })
  }
}
