const log = require('../log')
const shell = require('shelljs')
const basePath = process.cwd()

const buildWin = () => {
  return new Promise((resolve, reject) => {
    log.info('开始打包electron-win')
    const exceStr = `electron-builder -w=nsis --x64 --ia32 --arm64 --config ./script/build/config/window.js `
    log.info(`exceStr:${exceStr}`)
    shell.exec(exceStr, (code) => {
      if (code !== 0) {
        reject('打包win失败')
        return
      }
      log.info('结束打包electron-win')
      resolve()
    })
  })
}
const buildMac = () => {
  return new Promise((resolve, reject) => {
    log.info('开始打包electron-mac')
    const exceStr = `electron-builder -m --x64 --arm64 --config ./script/build/config/mac.js `
    log.info(`exceStr:${exceStr}`)
    shell.exec(exceStr, (code) => {
      if (code !== 0) {
        reject('打包mac失败')
        return
      }
      log.info('结束打包electron-mac')
      resolve()
    })
  })
}

const buildLinux = () => {
  return new Promise((resolve, reject) => {
    log.info('开始打包electron-linux')
    const exceStr = `electron-builder -l=deb --x64 --arm64 --armv7l --config ./script/build/config/linux.js `
    log.info(`exceStr:${exceStr}`)
    shell.exec(exceStr, (code) => {
      if (code !== 0) {
        reject('打包linux失败')
        return
      }
      log.info('结束打包electron-linux')
      resolve()
    })
  })
}
module.exports = () => {
  return new Promise((resolve, reject) => {
    log.info('开始打包electron')
    shell.cd(basePath)
    const platform = process.platform
    let buildFunc = null
    if (platform === 'darwin') {
      log.info('处于mac环境,同时打包mac,win,linux')
      buildFunc = () => buildMac().then(buildWin).then(buildLinux)
    } else if (platform === 'win32') {
      log.info('处于win环境,只打包win')
      buildFunc = () => buildWin()
      return
    } else if (platform === 'linux') {
      log.info('处于linux环境,只打包linux')
      buildFunc = () => buildLinux()
      return
    }
    buildFunc()
      .then(resolve)
      .catch(reject)
      .finally(() => log.info('结束打包electron'))
  })
}
