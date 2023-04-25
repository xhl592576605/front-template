const log = require('../log')
const shell = require('shelljs')
const basePath = process.cwd()

const buildWin = () => {
  return new Promise((resolve, reject) => {
    shell.exec(
      `electron-builder -w=nsis --x64 --ia32 --arm64 --config ./script/build/config/window.js `,
      (code) => {
        if (code !== 0) {
          reject('打包win失败')
          return
        }
        resolve()
      }
    )
  })
}
const buildMac = () => {
  return new Promise((resolve, reject) => {
    shell.exec(
      `electron-builder -m --x64 --arm64 --config ./script/build/config/mac.js `,
      (code) => {
        if (code !== 0) {
          reject('打包mac失败')
          return
        }
        resolve()
      }
    )
  })
}

const buildLinux = () => {
  return new Promise((resolve, reject) => {
    shell.exec(
      `electron-builder -l=deb --x64 --ia32 --arm64 --armv7l --config ./script/build/config/linux.js `,
      (code) => {
        if (code !== 0) {
          reject('打包linux失败')
          return
        }
        resolve()
      }
    )
  })
}
module.exports = () => {
  return new Promise((resolve, reject) => {
    log.info('开始打包electron')
    shell.cd(basePath)
    const platform = process.platform
    if (platform === 'darwin') {
      log.info('处于mac环境,同时打包mac,win,linux')
      const buildAll = Promise.all([buildWin(), buildMac(), buildLinux()])
      buildAll.then(resolve).catch(reject)
      return
    } else if (platform === 'win32') {
      log.info('处于win环境,只打包win')
      buildWin().then(resolve).catch(reject)
      return
    } else if (platform === 'linux') {
      log.info('处于linux环境,只打包linux')
      buildLinux().then(resolve).catch(reject)
      return
    }
  })
}
