import ElectronLog from 'electron-log'
export interface CreateLoggerOption {
  logId: string
  logPath: string | (() => string)
}
export default (option: CreateLoggerOption) => {
  const logger = ElectronLog.create(option.logId)
  return logger
}
