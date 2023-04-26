import path from 'path'
import { app } from 'electron'
import debug from 'debug'
import merge from 'lodash/merge'
import { CoreOptions, CorePlugin, Options } from '../types/core-options'
import Hooks from './hooks'

class Core {
  private debug = debug('core')
  public options: CoreOptions | undefined
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
  public init(options?: Options) {
    /**
     * 1. 应用hooks
     * 2. 合并内部option
     * 3. 初始化配置
     * 4. 开始走流程
     */
    this.usePlugin(this.options?.plugins || [])
    this.mergeOption(options)
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
      env: env.NODE_ENV || 'production',
      platform,
      arch,
      baseDir: path.join(app.getAppPath(), 'native'),
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
      execDir: app.getAppPath()
    }
    if (options.env == 'production' && app.isPackaged) {
      options.execDir = path.dirname(app.getPath('exe'))
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
