import path from 'path'
import fs from 'fs'
import Core from '../core'
import { CorePlugin } from './core-plugin'
import createLogger, { CreateLoggerOption } from '../utils/logger'
export default class CoreLoggerPlugin implements CorePlugin {
  name = 'core-logger-plugin'

  apply($core: Core) {
    const reportLog = (
      sumbitUrl: string,
      data: Record<string, any>,
      header?: Record<string, any>,
      options?: {
        lastest?: boolean
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
        $core.mainLogger.info('$core awaitInitLogger called successfully')
        $core.reportLog = reportLog.bind($core)
      }
    )
  }
}
