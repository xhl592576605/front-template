import ElectronLog, { LogFile, LevelOption } from 'electron-log'
import { isPackaged } from '../ps'
import path from 'path'
import fs from 'fs'
import dayjs from 'dayjs'
export interface CreateLoggerOption {
  logPath: string
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
      return path.join(
        option.logPath,
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
        const date = new Date()
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
        '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}')
  option.level
    ? (logger.transports.file.level = option.level)
    : (logger.transports.file.level = 'debug')
  logger.transports.console.level = option.console ? 'debug' : false
  logger.info(`${logId} logger initialized`)
  return logger
}
