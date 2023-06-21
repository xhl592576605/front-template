import { ElectronLog, LogFunctions } from 'electron-log'

/**
 * 捕获异常
 */
export const start = (logger: ElectronLog | LogFunctions) => {
  uncaughtExceptionHandler(logger)
  unhandledRejectionHandler(logger)
}

/**
 * 当进程上抛出异常而没有被捕获时触发该事件，并且使异常静默。
 */
export const uncaughtExceptionHandler = (
  logger: ElectronLog | LogFunctions
) => {
  process.on('uncaughtException', function (err) {
    if (!(err instanceof Error)) {
      err = new Error(String(err))
    }

    if (err.name === 'Error') {
      err.name = 'unhandledExceptionError'
    }
    logger.error(err)
  })
}

export const unhandledRejectionHandler = (
  logger: ElectronLog | LogFunctions
) => {
  process.on('unhandledRejection', function (err: any) {
    if (!(err instanceof Error)) {
      const newError = new Error(String(err))
      // err maybe an object, try to copy the name, message and stack to the new error instance
      if (err) {
        if (err.name) newError.name = err.name
        if (err.message) newError.message = err.message
        if (err.stack) newError.stack = err.stack
      }
      err = newError
    }
    if (err.name === 'Error') {
      err.name = 'unhandledRejectionError'
    }

    logger.error(err)
  })
}
