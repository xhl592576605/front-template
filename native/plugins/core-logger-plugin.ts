import fs from 'fs'
import Core from '../core'
import * as Exception from '../exception'
import createLogger from '../utils/logger'
import { CorePlugin } from './core-plugin'

export default class CoreLoggerPlugin implements CorePlugin {
  name = 'core-logger-plugin'

  apply($core: Core) {
    const reportLog = (
      submitUrl: string,
      data: Record<string, any>,
      header?: Record<string, any>,
      options?: {
        latest?: boolean
        day?: number
        upload?: boolean
      }
    ) => {
      //todo: 要做上传日志的业务
    }
    $core.hooks.awaitInitLogger.tapPromise(
      {
        name: this.name,
        stage: -1
      },
      async () => {
        const logPath = $core.config.logger.dir
        if (!fs.existsSync(logPath)) {
          fs.mkdirSync(logPath, { recursive: true })
        }
        Object.entries($core.config.logger.log).forEach(([key, value]) => {
          ;($core as any)[`${key}Logger`] = createLogger(key, {
            logPath,
            ...value
          })
        })
        $core.mainLogger.info(
          `$core ${this.name} plugin awaitInitLogger called successfully`
        )
        // 在日志模块初始化后，捕获全局异常，写入日志
        Exception.start($core.mainLogger)
        $core.reportLog = reportLog.bind($core)
      }
    )
  }
}
