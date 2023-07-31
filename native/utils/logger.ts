import dayjs from 'dayjs'
import ElectronLog, { LevelOption, LogFile } from 'electron-log'
import fs from 'fs'
import path from 'path'
import { isPackaged } from '../ps'
export interface CreateLoggerOption {
  logPath: string | (() => string)
  fileName: string
  maxSize?: number
  archiveLog?: (oldLogFile: LogFile) => void
  format?: string
  level?: LevelOption
  console?: boolean
}
export default (logId: string, option: CreateLoggerOption) => {
  const logger = ElectronLog.create(logId)
  logger.transports.file.resolvePath = () => {
    if (isPackaged()) {
      let logPath = option.logPath
      if (option.logPath instanceof Function) {
        logPath = option.logPath()
      }
      return path.join(
        logPath as string,
        `${dayjs().format('YYYY-MM-DD')}/${option.fileName}`
      )
    }

    return path.join(
      process.env.INIT_CWD || process.cwd(),
      `logs/${dayjs().format('YYYY-MM-DD')}/${option.fileName}`
    )
  }

  option.maxSize = option.maxSize || 1024 * 1024 * 10 // 10M

  option.archiveLog
    ? (logger.transports.file.archiveLog = option.archiveLog)
    : (logger.transports.file.archiveLog = (file) => {
        const info = path.parse(file.path)

        try {
          fs.renameSync(
            file.path,
            path.join(
              info.dir,
              info.name + `.${dayjs().format('HHmmssSSS')}` + info.ext
            )
          )
        } catch (e) {
          console.warn('Could not rotate log', e)
        }
      })

  option.format
    ? (logger.transports.file.format = option.format)
    : (logger.transports.file.format =
        '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}')
  option.level
    ? (logger.transports.file.level = option.level)
    : (logger.transports.file.level = 'debug')
  logger.transports.console.level = option.console ? 'debug' : false
  logger.info(`${logId} logger initialized`)
  return logger
}
