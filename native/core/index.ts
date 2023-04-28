import path from 'path'
import { app } from 'electron'
import debug from 'debug'
import merge from 'lodash/merge'
import { ApplicationConfig } from '../types/config'
import { CoreOptions, Options } from '../types/core-options'
import CorePlugins, { CorePlugin } from '../plugins'
import Hooks from './hooks'

class Core {
  /**
   * 定义一些虚拟方法，在对应的插件进行实现
   */
  declare config: ApplicationConfig
  declare getConfigFilePath: () => string
  declare updateConfigFile: () => void

  private debug = debug('core')
  public options!: CoreOptions
  public hooks: Hooks

  constructor() {
    /**
     * 1. 初始化内部参数
     * 2. 初始化hooks
     */
    this.initOptions()
    this.hooks = new Hooks()
  }

  /**
   * 运行应用
   */
  public async init(options?: Options) {
    /**
     * 1. 应用hooks
     * 2. 合并内部option
     * 3. 初始化配置
     * 4. 开始走流程
     */
    this.usePlugin(this.options?.plugins || [])
    this.mergeOption(options)

    // 初始化配置
    this.hooks.beforeGetConfig.call(this)
    await this.hooks.awaitGetConfig.promise(this)
    this.hooks.afterGetConfig.call(this)

    // 初始化logger
    this.hooks.beforeInitLogger.call(this)
    await this.hooks.awaitInitLogger.promise(this)
    this.hooks.afterInitLogger.call(this)

    // 初始化应用

    return this
  }

  /**
   * 使用插件
   * @param plugins
   */
  public usePlugin(plugins: CorePlugin | CorePlugin[]) {
    if (!Array.isArray(plugins)) {
      plugins = [plugins]
    }
    plugins.forEach((plugin) => {
      if (!plugin.name || !(typeof plugin.apply === 'function')) {
        this.debug('no standard plugin', plugin.constructor)
        return
      }
      plugin.apply(this)
    })
    return this
  }

  /**
   * 初始化参数
   */
  private initOptions() {
    const { env, platform, arch } = process
    const options: CoreOptions = {
      env: (env.NODE_ENV as any) || 'production',
      platform,
      arch,
      baseDir: app.getAppPath(),
      homeDir: app.getAppPath(),
      appName: app.getName(),
      appVersion: app.getVersion(),
      userHome: app.getPath('home'),
      appData: app.getPath('appData'),
      appUserData: app.getPath('userData'),
      temp: app.getPath('temp'),
      logs: app.getPath('logs'),
      crashDumps: app.getPath('crashDumps'),
      isPackaged: app.isPackaged,
      execDir: app.getAppPath(),
      plugins: CorePlugins
    }
    if (options.env == 'production' && options.isPackaged) {
      options.execDir = path.dirname(app.getPath('exe'))
      options.baseDir = path.join(app.getAppPath(), 'out')
    }
    if (!options.isPackaged) {
      options.homeDir = path.join(options.homeDir, '../')
    }
    this.options = options
  }

  /**
   *  合并option
   * @param outOptions 外部option
   */
  private mergeOption(outOptions?: Options) {
    const options = this.options!
    if (outOptions) {
      outOptions = this.hooks.beforeMergeOption.call(outOptions)
      merge(options, outOptions)
    }
    const { env } = process
    env.NODE_ENV = options.env
    console.log(this.options)
    this.debug('options:%j', this.options)
  }

  /**
   * 初始化配置
   */
  private initConfig() {
    /**
     * 1.初始化配置
     */
  }
}

export default Core
