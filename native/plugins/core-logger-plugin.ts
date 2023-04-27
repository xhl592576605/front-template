import path from 'path'
import fs from 'fs'
import Core from '../core'
import { CorePlugin } from './core-plugin'
import ElectronLog from 'electron-log'

export default class CoreLoggerPlugin implements CorePlugin {
  name = 'core-logger-plugin'
  apply($core: Core) {
    $core.hooks.beforeInitLogger.tap(this.name, () => {
      console.log('beforeInitLogger')
    })
    $core.hooks.awaitInitLogger.tapPromise(this.name, async () => {
      const logger = ElectronLog.create('electron')
      logger.transports.console.level = false
      logger.transports.file.maxSize = 10 // 文件最大不超过 10M
      logger.transports.file.format =
        '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
      const date = new Date()
      const dateStr =
        date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      logger.transports.file.resolvePath = () => {
        const options = $core.options
        const { isPackaged } = options
        if (isPackaged) {
          return options.logs
        }
        return path.join(
          process.env.INIT_CWD || process.cwd(),
          `logs/${dateStr}.log`
        )
      }
      logger.transports.file.archiveLog = (file) => {
        const info = path.parse(file.path)

        try {
          fs.renameSync(
            file.path,
            path.join(info.dir, info.name + '.old' + info.ext)
          )
        } catch (e) {
          console.warn('Could not rotate log', e)
        }
      }
      for (let i = 0; i < 100; i++) {
        logger.info('logger init11111111111111')
      }
      console.log('awaitInitLogger')
    })
    $core.hooks.afterInitLogger.tap(this.name, () => {
      console.log('afterInitLogger')
    })
  }
}
