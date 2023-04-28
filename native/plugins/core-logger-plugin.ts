import path from 'path'
import fs from 'fs'
import Core from '../core'
import { CorePlugin } from './core-plugin'
import createLogger from '../utils/logger'
export default class CoreLoggerPlugin implements CorePlugin {
  name = 'core-logger-plugin'
  apply($core: Core) {
    $core.hooks.beforeInitLogger.tap(this.name, () => {
      console.log('beforeInitLogger')
    })
    $core.hooks.awaitInitLogger.tapPromise(this.name, async () => {
      const logger = createLogger('electron', {
        logPath: $core.options.logs,
        fileName: 'electron.log',
        maxSize: 1024
      })
    })
    $core.hooks.afterInitLogger.tap(this.name, () => {
      console.log('afterInitLogger')
    })
  }
}
