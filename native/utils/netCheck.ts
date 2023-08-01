import axios from 'axios'
import DNS from 'dns'
import PING from 'ping'
import systeminformation from 'systeminformation'

const dnsCheck = (domain = 'api.ecoach.evideo.tech') => {
  return new Promise<boolean>((resolve, reject) => {
    DNS.resolve(domain, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        reject(err || new Error('dns check error'))
        return
      }
      resolve(true)
    })
  })
}

const pingCheck = (domain = 'api.ecoach.evideo.tech') => {
  return new Promise<boolean>((resolve, reject) => {
    PING.sys.probe(domain, (isAlive, err) => {
      if (!isAlive || err) {
        reject(err || new Error('ping check error'))
        return
      }
      resolve(isAlive)
    })
  })
}

const httpCheck = (domain = 'gateway.ecoach.evideo.tech/healthz') => {
  return new Promise<boolean>((resolve, reject) => {
    const axiosInstance = axios.create({
      baseURL: 'https://',
      timeout: 5000
    })
    axiosInstance
      .options(domain)
      .then((res) => {
        if (res.status !== 200) {
          reject(new Error('http check error'))
          return
        }
        resolve(true)
      })
      .catch(reject)
  })
}

const realTimeNetworkSpeed = (
  interfaceName: string | undefined = undefined
) => {
  return new Promise<{
    sentSpeed: number
    recvSpeed: number
  }>((resolve, reject) => {
    systeminformation
      .networkStats(interfaceName)
      .then((data) => {
        const sent_speed = data[0] ? data[0].tx_sec / 1024 : 0 // 上行速度（MB/s）
        const recv_speed = data[0] ? data[0].rx_sec / 1024 : 0 // 下行速度（MB/s）
        resolve({
          sentSpeed: parseFloat(sent_speed.toFixed(2)),
          recvSpeed: parseFloat(recv_speed.toFixed(2))
        })
      })
      .catch(reject)
  })
}

const downloadSpeedCheck = (
  url = 'https://public.ecoach.evideo.tech/net-test-1m.zip'
) => {
  return new Promise((resolve, reject) => {
    const startTime = new Date().getTime()
    let downloadedBytes = 0
    axios({
      method: 'get',
      url: url,
      responseType: 'stream'
    }).then((res) => {
      res.data.on('data', (chunk: any) => {
        downloadedBytes += chunk.length
      })
      res.data.on('end', () => {
        const endTime = new Date().getTime()
        const downloadTime = (endTime - startTime) / 1000 // 转换为秒
        const downloadSpeed = downloadedBytes / downloadTime
        resolve(downloadSpeed)
      })
      res.data.on('error', reject)
    })
  })
}

export {
  dnsCheck,
  downloadSpeedCheck,
  httpCheck,
  pingCheck,
  realTimeNetworkSpeed
}
