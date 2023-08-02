import dayjs from 'dayjs'
import dgram from 'dgram'
import sudo from 'sudo-prompt'
import PromiseAny from './promiseAny'

export const defaultNtpPort = 123
export const defaultNtpServer = 'ntp1.aliyun.com'
export const defaultNtpTimeout = 10000
export const defaultMultiNtpServer = [
  defaultNtpServer,
  'ntp1.aliyun.com',
  'ntp2.aliyun.com',
  'ntp3.aliyun.com',
  'ntp4.aliyun.com',
  'ntp5.aliyun.com',
  'ntp6.aliyun.com',
  'ntp7.aliyun.com'
]

/**
 * 获取ntp时间
 * @param server
 * @param port
 * @param timeout
 * @returns
 */
const getNetworkTime = (server?: string, port?: number, timeout?: number) => {
  return new Promise((resolve, reject) => {
    server = server || defaultNtpServer
    port = port || defaultNtpPort
    timeout = timeout || defaultNtpTimeout
    const client = dgram.createSocket('udp4')
    const buffer = Buffer.alloc(48, 0)
    buffer[0] = 0x1b
    const timer = setTimeout(() => {
      client.close()
      reject(new Error('Timeout'))
    }, timeout)

    let errorFired = false
    client.on('error', (err) => {
      if (errorFired) return
      client.close()
      reject(err)
      errorFired = true
      clearTimeout(timer)
    })

    client.send(buffer, 0, buffer.length, port, server, (err) => {
      if (errorFired) return
      if (err) {
        client.close()
        reject(err)
        errorFired = true
        clearTimeout(timer)
        return
      }
      client.on('message', (msg) => {
        if (errorFired) return
        client.close()
        const offsetTransmitTime = 40
        let intpart = 0
        let fractpart = 0

        // Get the seconds part
        for (let i = 0; i <= 3; i++) {
          intpart = 256 * intpart + msg[offsetTransmitTime + i]
        }

        // Get the seconds fraction
        for (let i = 4; i <= 7; i++) {
          fractpart = 256 * fractpart + msg[offsetTransmitTime + i]
        }

        const milliseconds = intpart * 1000 + (fractpart * 1000) / 0x100000000

        // **UTC** time
        const date = new Date('Jan 01 1900 GMT')
        date.setUTCMilliseconds(date.getUTCMilliseconds() + milliseconds)
        resolve(date)
        errorFired = true
        clearTimeout(timer)
      })
    })
  })
}

/**
 * 执行多个ntp服务器，返回最快的时间
 * @param server
 * @returns
 */
const getNetworkTimeByMultiServer = (
  server = defaultMultiNtpServer
): Promise<Date> => {
  if (!Array.isArray(server)) {
    server = [server]
  }
  const getNetworkTimes = server.map((item) => getNetworkTime(item))
  return PromiseAny(getNetworkTimes) as Promise<Date>
}

const chengLocalTime = (time: Date) => {
  return new Promise((resolve, reject) => {
    const platform = process.platform
    let cmd = ''
    switch (platform) {
      case 'win32':
        cmd = `date ${dayjs(time).format('YYYY-MM-DD')} && time ${dayjs(
          time
        ).format('HH:mm:ss')}`
        break
      case 'darwin':
        cmd = `date -f "%Y-%m-%d %H:%M:%S" "${dayjs(time).format(
          'YYYY-MM-DD HH:mm:ss'
        )}"`
        break
      case 'linux':
        cmd = `date -s "${dayjs(time).format('YYYY-MM-DD HH:mm:ss')}"`
        break
    }

    if (!cmd) {
      reject(new Error('不支持的系统'))
      return
    }
    sudo.exec(cmd, { name: 'Time' }, (error, stdout) => {
      if (error) {
        reject(error)
        return
      }
      resolve(stdout)
    })
  })
}

export default getNetworkTime

export { chengLocalTime, getNetworkTimeByMultiServer }
