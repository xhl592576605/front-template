import { ipcRenderer } from 'electron'
import { IpcMainChannel, IpcWebContentChannel } from '../ipcChannel'

export default {
  dnsCheck: (domain: string) =>
    ipcRenderer.invoke(IpcMainChannel.NetWork.DNS_CHECK, domain),
  pingCheck: (domain: string) =>
    ipcRenderer.invoke(IpcMainChannel.NetWork.PING_CHECK, domain),
  httpCheck: (domain: string) =>
    ipcRenderer.invoke(IpcMainChannel.NetWork.HTTP_CHECK, domain),
  localDateCheck: () =>
    ipcRenderer.invoke(IpcMainChannel.NetWork.LOCAL_DATE_CHECK),
  changeLocalDate: (date: string) =>
    ipcRenderer.invoke(IpcMainChannel.NetWork.CHANGE_LOCAL_DATE, date),
  getRealTimeNetworkSpeed: (interfaceName: string | undefined) =>
    ipcRenderer.invoke(
      IpcMainChannel.NetWork.GET_REALTIME_NET_SPEED_CHECK,
      interfaceName
    ),
  onNetStatus: (listener: (...args: any[]) => void) => {
    ipcRenderer.on(IpcWebContentChannel.NetWork.NetStatus, listener)
  },
  onNetRealSpeed: (listener: (...args: any[]) => void) => {
    ipcRenderer.on(IpcWebContentChannel.NetWork.NetRealSpeed, listener)
  }
}
