import dayjs from 'dayjs'
import Core from 'native/core'
import { IpcMainChannel } from '../preload/ipcChannel'
import { chengLocalTime, getNetworkTimeByMultiServer } from '../utils/ntpClient'
import { CorePlugin } from './corePlugin'

export default class CoreTimeCheck implements CorePlugin {
  name = 'core-time-check-plugin'
  FIXED_DATE = '2021-01-01 00:00:00'
  DIFF_MINUTES = 3
  apply($core: Core) {
    /**
     * 检查本地时间是否正确
     * 1. 获取网络时间，相差3分钟以内都算正确
     * 2. 如果网络时间获取失败，那么就用固定时间2021-01-01 00:00:00，大于该时间都算正确
     * @returns
     */
    const checkLocalTime = () => {
      return new Promise((resolve) => {
        const localDate = dayjs()
        const result = {
          diffMinute: 0,
          isCorrect: true
        }
        getNetworkTimeByMultiServer()
          .then((serverDate: Date) => {
            const realDate = dayjs(serverDate)
            $core.mainLogger?.info(
              `serverDate:${realDate.format(
                'YYYY-MM-DD HH:mm:ss'
              )};localDate:${localDate.format('YYYY-MM-DD HH:mm:ss')}`
            )
            const diff = realDate.diff(localDate, 'minute')
            if (Math.abs(diff) > this.DIFF_MINUTES) {
              result.diffMinute = diff
              result.isCorrect = false
              resolve(result)
              return
            }
            resolve(result)
          })
          .catch(() => {
            const fixedDate = dayjs(this.FIXED_DATE)
            $core.mainLogger?.info(
              `fixedDate:${fixedDate.format(
                'YYYY-MM-DD HH:mm:ss'
              )};localDate:${localDate.format('YYYY-MM-DD HH:mm:ss')}`
            )
            if (localDate.isBefore(fixedDate)) {
              result.diffMinute = fixedDate.diff(localDate, 'minute')
              result.isCorrect = false
              resolve(result)
              return
            }
            resolve(result)
          })
      })
    }
    $core.lifeCycle.afterCreateMainWindow.tap(this.name, () => {
      $core.addIpcMainListener(IpcMainChannel.NetWork.LOCAL_DATE_CHECK, () =>
        checkLocalTime()
      )
      $core.addIpcMainListener(
        IpcMainChannel.NetWork.CHANGE_LOCAL_DATE,
        (e, date: string) => {
          const isDate = dayjs(date).isValid()
          if (!isDate) {
            throw new Error('date is invalid')
            return
          }
          return chengLocalTime(dayjs(date).toDate())
        }
      )
    })
  }
}
