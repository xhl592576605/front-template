import AdmZip from 'adm-zip'
import dayjs from 'dayjs'
import {
  OnBeforeRequestListenerDetails,
  OnCompletedListenerDetails,
  OnErrorOccurredListenerDetails,
  OnSendHeadersListenerDetails
} from 'electron'
import { ElectronLog, LogFunctions } from 'electron-log'
import fs from 'fs-extra'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import path from 'path'
import { v4 as createUUID } from 'uuid'
import Core from '../core'
import * as Exception from '../exception'
import { IpcMainChannel } from '../preload/ipcChannel'
import { isMainServerProd } from '../ps'
import { encrypt } from '../utils/crypto'
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
    const loggerKeyObj = {
      name: this.name,
      stage: -1
    }

    /**
     *  排序日志文件夹，按照时间最新降序
     * @returns
     */
    const sortLogPath = () => {
      const logPath = getLogPath()
      // 读取logPath下的所有文件夹,按照时间排序
      const dirs =
        fs
          .readdirSync(logPath)
          .map((dir) => path.join(logPath, dir))
          .filter((dir) => fs.statSync(dir).isDirectory())
          .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs) || []
      return dirs
    }

    /**
     * 获取日志文件夹路径，在开发时，获取的还是软件的日志保存，但是真实记录却是在项目的日志文件夹下
     * @returns
     */
    const getLogPath = () => {
      let logPath = $core.config.logger.dir
      if ($core.config.setting?.icePointPath) {
        logPath = path.join($core.config.setting?.icePointPath, 'logs')
      }
      return logPath
    }

    /**
     * 将当前存放的日志文件夹移到指定位置，需要重新启动
     * @param destPath
     * @returns
     */
    const moveLogFiles = (destPath: string) => {
      const srcLogPath = getLogPath()
      if (!fs.existsSync(srcLogPath)) {
        $core.mainLogger.error(`move log file:${srcLogPath} no exists`)
        return
      }
      fs.moveSync(srcLogPath, path.join(destPath, 'logs'), {
        overwrite: true
      })
      $core.mainLogger.info(
        `move log file:${srcLogPath} to ${destPath} success`
      )
    }

    /**
     * 保留最近的日志文件夹数量，移除多余的日志文件夹
     * @param latestNum 保留最近的日志文件夹数量
     */
    const removeLogFiles = (latestNum: number) => {
      return new Promise<void>(() => {
        const dirs = sortLogPath()
        //去掉除了最近的latestNum个文件夹
        dirs.slice(latestNum).forEach((dir) => fs.removeSync(dir))
      })
    }

    const getLogFileBuffer = () => {
      const logName = `${
        $core.options.mac.toUpperCase()?.replace(/:/g, '') || 'MAC'
      }-${dayjs().format('YYYY-MM-DD')}`
      let dirs = sortLogPath()
      dirs = dirs.slice(0, $core.config.logger.latestNum || 3)
      const zip = new AdmZip()
      dirs.forEach((dir) => {
        zip.addLocalFolder(dir, path.join(logName, path.basename(dir)))
      })
      const zipData = zip.toBuffer()
      return zipData
    }

    //! 日志模块初始化
    $core.lifeCycle.awaitInitLogger.tapPromise(loggerKeyObj, async () => {
      // * 如果有冰点路径，就使用冰点路径，否则使用默认路径来创建日志文件夹
      const logPath = getLogPath()
      if (!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath, { recursive: true })
      }
      $core.logger = createLogger('main', {
        logPath: getLogPath(), // 创建时，使用函数，保证日志记录到正确的文件夹
        ...$core.config.logger
      })
      $core.mainLogger = $core.logger.scope('main')
      $core.netLogger = $core.logger.scope('net')
      $core.rendererLogger = $core.logger.scope('renderer')
      $core.webViewLogger = $core.logger.scope('webview')

      $core.mainLogger.info(
        `$core ${this.name} plugin awaitInitLogger called successfully`
      )
      // 在日志模块初始化后，捕获全局异常，写入日志
      Exception.start($core.mainLogger)
      $core.getLogFileBuffer = getLogFileBuffer.bind($core)
      $core.getLogPath = getLogPath.bind($core)
      $core.moveLogFiles = moveLogFiles.bind($core)
    })

    $core.lifeCycle.beforeAppQuit.tap(loggerKeyObj, async () => {
      // 退出时，移除多余的日志文件夹
      removeLogFiles($core.config.logger.latestNum || 3)
    })

    $core.lifeCycle.afterCreateMainWindow.tap(this.name, () => {
      $core.addIpcMainListener(IpcMainChannel.App.GET_LOG_BUFFER, () =>
        $core.getLogFileBuffer()
      )
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
      $core.netLogger.log(
        logObj.statusCode,
        JSON.stringify(logObj, null, isMainServerProd() ? 0 : 2) + '\n'
      )
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

        if (uploadData && uploadData.length > 0) {
          const bytes = uploadData[0].bytes
          const decoder = new TextDecoder('utf-8')
          const uploadDataStr = decoder.decode(bytes)
          logObj.uploadDataStr = encrypt(uploadDataStr, id.toString())
        }
        const netLogObj: NetLogObj = {
          beforeRequest: logObj as BeforeRequestLogObj
        }
        netLogObjMap.set(id, netLogObj)
        return callbackResponse
      }
    )
    $core.lifeCycle.awaitWebRequestOnBeforeSendHeaders.tapPromise(
      loggerKeyObj,
      async (beforeSendResponse, detail) => {
        beforeSendResponse.requestHeaders = {
          ...beforeSendResponse.requestHeaders,
          'Electron-Client-Name': $core.options.appName,
          'Electron-Client-Version': $core.options.appVersion,
          'Electron-Client-Platform': $core.options.platform,
          'Electron-Client-Mac': $core.options.mac,
          'Electron-Client-Arch': $core.options.arch,
          'Electron-Client-Ip': $core.options.ip,
          'Electron-Client-MainServerEnv': $core.config.mainServerEnv,
          'Electron-Client-WebRequest-UUID': `${createUUID()}_${detail.id}`
        }
        return beforeSendResponse
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
      async (details) => {
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
      async (details) => {
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
      const _message = message.replace(matchStr + '-', '')
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
      logger: ElectronLog | LogFunctions,
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
      const { webContents } = core.mainWindow || {}
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
