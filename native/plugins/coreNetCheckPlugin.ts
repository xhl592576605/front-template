import { Job, RecurrenceRule, scheduleJob } from 'node-schedule'
import Core from '../core'
import { IpcMainChannel, IpcWebContentChannel } from '../preload/ipcChannel'
import {
  dnsCheck,
  downloadSpeedCheck,
  httpCheck,
  pingCheck,
  realTimeNetworkSpeed
} from '../utils/netCheck'
import { CorePlugin } from './corePlugin'

export default class CoreNetCheckPlugin implements CorePlugin {
  isRegularCheck: boolean // 是否定时检查
  regularInterval: number // 定时检查的间隔(秒)
  constructor(isRegularCheck = true, interval = 5) {
    this.isRegularCheck = isRegularCheck
    this.regularInterval = interval
  }
  name = 'core-net-check-plugin'
  apply($core: Core) {
    let netCheckJob: Job | null = null
    let netRealSpeedCheckJob: Job | null = null
    $core.lifeCycle.afterCreateMainWindow.tap(this.name, () => {
      if (this.isRegularCheck) {
        const recurrenceRule = new RecurrenceRule()
        recurrenceRule
        netCheckJob = scheduleJob(`*/${this.regularInterval} * * * * *`, () => {
          Promise.allSettled([dnsCheck(), pingCheck(), httpCheck()]).then(
            (res) => {
              const [dns, ping, http] = res
              if (
                dns.status === 'fulfilled' &&
                ping.status === 'fulfilled' &&
                http.status === 'fulfilled'
              ) {
                $core.sendToIpcRendererByNoLog(
                  IpcWebContentChannel.NetWork.NetStatus,
                  {
                    dns: dns.value,
                    ping: ping.value,
                    http: http.value
                  }
                )
                $core.mainLogger.debug('net check result', res)
                return
              }
              $core.sendToIpcRendererByNoLog(
                IpcWebContentChannel.NetWork.NetStatus,
                {
                  dns: dns.status === 'fulfilled' ? dns.value : false,
                  ping: ping.status === 'fulfilled' ? ping.value : false,
                  http: http.status === 'fulfilled' ? http.value : false
                }
              )
              $core.mainLogger.info('net check result', res)
            }
          )
        })

        // 定时1s去检查网速
        netRealSpeedCheckJob = scheduleJob('*/1 * * * * *', () => {
          realTimeNetworkSpeed().then((res) => {
            $core.sendToIpcRendererByNoLog(
              IpcWebContentChannel.NetWork.NetRealSpeed,
              res
            )
            $core.mainLogger.debug(
              `realtime net speed check result,uploadSpeed:${res.sentSpeed}KB/s;downloadSpeed:${res.recvSpeed}KB/s`
            )
          })
        })
      }
      $core.addIpcMainListener(IpcMainChannel.NetWork.DNS_CHECK, (e, domain) =>
        dnsCheck(domain)
      )
      $core.addIpcMainListener(IpcMainChannel.NetWork.PING_CHECK, (e, domain) =>
        pingCheck(domain)
      )
      $core.addIpcMainListener(IpcMainChannel.NetWork.HTTP_CHECK, (e, domain) =>
        httpCheck(domain)
      )
      $core.addIpcMainListener(
        IpcMainChannel.NetWork.DOWNLOAD_SPEED_CHECK,
        (e, url) => {
          return downloadSpeedCheck(url)
        }
      )
      $core.addIpcMainListener(
        IpcMainChannel.NetWork.GET_REALTIME_NET_SPEED_CHECK,
        (e, interfaceName) => realTimeNetworkSpeed(interfaceName)
      )
    })
    $core.lifeCycle.beforeAppQuit.tap(this.name, () => {
      netCheckJob && netCheckJob.cancel()
      netRealSpeedCheckJob && netRealSpeedCheckJob.cancel()
    })
  }
}
