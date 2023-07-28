import { NetworkInterfaceInfoIPv4, networkInterfaces } from 'os'
const macRegex = /(?:[a-z0-9]{1,2}[:-]){5}[a-z0-9]{1,2}/i
const zeroRegex = /(?:[0]{1,2}[:-]){5}[0]{1,2}/

/**
 * Get the first proper MAC address
 * @param iface If provided, restrict MAC address fetching to this interface
 */
export default (iface?: string): NetworkInterfaceInfoIPv4 => {
  const list = networkInterfaces()
  if (iface) {
    const parts = list[iface]
    if (!parts) {
      throw new Error(`interface ${iface} was not found`)
    }
    for (const part of parts) {
      if (
        zeroRegex.test(part.mac) === false &&
        part.family === 'IPv4' &&
        part.address !== '127.0.0.1' &&
        part.internal === false
      ) {
        return part
      }
    }
    throw new Error(`interface ${iface} had no valid mac addresses`)
  } else {
    for (const [, parts] of Object.entries(list)) {
      // for some reason beyond me, this is needed to satisfy typescript
      // fix https://github.com/bevry/getmac/issues/100
      if (!parts) continue
      for (const part of parts) {
        if (
          zeroRegex.test(part.mac) === false &&
          part.family === 'IPv4' &&
          part.address !== '127.0.0.1' &&
          part.internal === false
        ) {
          return part
        }
      }
    }
  }
  throw new Error('failed to get the MAC address')
}

/** Check if the input is a valid MAC address */
export const isMAC = (macAddress: string) => {
  return macRegex.test(macAddress)
}
