import getPort, { makeRange } from 'get-port'

/**
 * 获取端口
 * @param port 默认端口，需要检查的端口
 * @param portRange 端口范围 若是默认端口不可用，则从范围内获取，若范围内也不可用，则随机获取
 */
export default (port: number, portRange?: [number, number]) => {
  if (port) {
    return getPort({ port }).then((_port) => {
      if (port !== _port) {
        return portRange
          ? getPort({ port: makeRange(portRange[0], portRange[1]) })
          : getPort()
      }
      return _port
    })
  } else if (!port && portRange) {
    return getPort({ port: makeRange(portRange[0], portRange[1]) })
  } else {
    return getPort()
  }
}
