import {
  OnBeforeRequestListenerDetails,
  OnCompletedListenerDetails,
  OnErrorOccurredListenerDetails,
  OnSendHeadersListenerDetails
} from 'electron'
import { ElectronLog } from 'electron-log'
import fs from 'fs'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import Core from '../core'
import * as Exception from '../exception'
import createLogger from '../utils/logger'
import { CorePlugin } from './corePlugin'

export type BeforeRequestLogObj = Omit<
  OnBeforeRequestListenerDetails,
  'webContentsId' | 'webContents' | 'frame' | 'uploadData'
> & { uploadDataStr?: string }

export type BeforeSendHeadersLogObj = Pick<
  OnSendHeadersListenerDetails,
  'id' | 'url' | 'timestamp' | 'requestHeaders'
>

export type CompleteLogObj = Omit<
  OnCompletedListenerDetails,
  'webContentsId' | 'webContents' | 'frame' | 'method'
>
export type ErrorLogObj = Omit<
  OnErrorOccurredListenerDetails,
  'webContentsId' | 'webContents' | 'frame' | 'method'
>
export type NetLogObj = {
  beforeRequest?: BeforeRequestLogObj
  beforeSendHeaders?: BeforeSendHeadersLogObj
  complete?: CompleteLogObj
  error?: ErrorLogObj
}
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

    const loggerKeyObj = {
      name: this.name,
      stage: -1
    }

    //! 日志模块初始化
    $core.lifeCycle.awaitInitLogger.tapPromise(loggerKeyObj, async () => {
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
    })

    //! 网络日志记录
    const netLogObjMap = new Map<number, NetLogObj>()

    const execNetLog = (id: number) => {
      const netLogObj = netLogObjMap.get(id)
      if (!netLogObj) return
      const { beforeRequest, beforeSendHeaders, complete, error } = netLogObj
      const timestamp = {
        startTimestamp: beforeRequest?.timestamp,
        finishTimestamp: complete?.timestamp || error?.timestamp,
        durationTimestamp:
          (complete?.timestamp || error?.timestamp || 0) -
          (beforeRequest?.timestamp || 0)
      }
      const logObj = {
        ...beforeRequest,
        ...timestamp,
        ...beforeSendHeaders,
        ...complete,
        ...error
      }
      $core.netLogger.log(logObj.statusCode, JSON.stringify(logObj, null, 0),'\n')
      netLogObjMap.delete(id)
    }

    $core.lifeCycle.awaitWebRequestOnBeforeRequest.tapPromise(
      loggerKeyObj,
      async (callbackResponse, details) => {
        const { id, uploadData } = details
        const logObj = omit<BeforeRequestLogObj>(details, [
          'webContentsId',
          'webContents',
          'frame',
          'uploadData'
        ])

        if (uploadData) {
          const bytes = uploadData[0].bytes
          const decoder = new TextDecoder('utf-8')
          logObj.uploadDataStr = decoder.decode(bytes)
        }
        const netLogObj: NetLogObj = {
          beforeRequest: logObj as BeforeRequestLogObj
        }
        netLogObjMap.set(id, netLogObj)
        return callbackResponse
      }
    )

    $core.lifeCycle.awaitWebRequestOnSendHeaders.tapPromise(
      loggerKeyObj,
      async (details) => {
        const { id } = details
        const netLogObj = netLogObjMap.get(id)
        if (netLogObj) {
          const logObj = pick<BeforeSendHeadersLogObj>(details, [
            'id',
            'url',
            'timestamp',
            'requestHeaders'
          ])
          netLogObj.beforeSendHeaders = logObj as BeforeSendHeadersLogObj
          netLogObjMap.set(id, netLogObj)
        }
      }
    )

    $core.lifeCycle.awaitWebRequestOnCompleted.tapPromise(
      loggerKeyObj,
      async (details, core) => {
        const { id } = details
        const netLogObj = netLogObjMap.get(id)
        if (netLogObj) {
          const logObj = omit<CompleteLogObj>(details, [
            'webContentsId',
            'webContents',
            'frame',
            'method'
          ])
          netLogObj.complete = logObj as CompleteLogObj
          netLogObjMap.set(id, netLogObj)
          execNetLog(id)
        }
      }
    )

    $core.lifeCycle.awaitWebRequestOnErrorOccurred.tapPromise(
      loggerKeyObj,
      async (details, core) => {
        const { id } = details
        const netLogObj = netLogObjMap.get(id)
        if (netLogObj) {
          const logObj = omit<ErrorLogObj>(details, [
            'webContentsId',
            'webContents',
            'frame',
            'method'
          ])
          netLogObj.error = logObj as ErrorLogObj
          netLogObjMap.set(id, netLogObj)
          execNetLog(id)
        }
      }
    )

    //! 渲染进程记录
    const handleConsoleMessage = (
      level: number,
      message: string
    ): { level: number; message: string } => {
      const reg = /\[(ALL|TRACE|DEBUG|INFO|WARN|ERROR|FETAL)\]/
      const result = reg.exec(message)

      if (!result) {
        return { level, message }
      }
      const [matchStr, levelStr] = result
      let _level = 0
      switch (levelStr) {
        case 'ALl':
        case 'TRACE':
        case 'INFO':
          _level = 0
          break
        case 'DEBUG':
          _level = 4
          break
        case 'WARN':
          _level = 2
          break
        case 'ERROR':
        case 'FETAL':
          _level = 3
          break
      }
      let _message = message.replace(matchStr + '-', '')
      return {
        level: _level,
        message: _message
      }
    }

    /**
     * 通用方法 记录console回来的日志
     * @param logger
     * @param level
     * @param message
     */
    const logConsoleMessage = (
      logger: ElectronLog,
      level: number,
      message: string
    ) => {
      const result = handleConsoleMessage(level, message)
      if (result.level === 0 || result.level === 1) {
        logger.info(result.message)
      } else if (result.level == 2) {
        logger.warn(result.message)
      } else if (result.level === 3) {
        logger.error(result.message)
      } else if (result.level === 4) {
        logger.debug(result.message)
      } else {
        logger.log(result.message)
      }
    }

    $core.lifeCycle.afterCreateMainWindow.tap(loggerKeyObj, async (core) => {
      const { webContents } = core.mainWindow
      if (webContents) {
        webContents.addListener('console-message', (_event, level, message) => {
          logConsoleMessage(core.rendererLogger, level, message)
        })
      } else {
        core.mainLogger.warn(
          'core.mainWindow.webContents no found,can"t log console-message'
        )
      }
    })
    /**
     * 暴露出去给外部webview的console-message调用
     * @param level
     * @param message
     */
    $core.execWebViewLog = (level: number, message: string) => {
      logConsoleMessage($core.webViewLogger, level, message)
    }
  }
}
