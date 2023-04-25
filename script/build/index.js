const log = require('../log')
const shell = require('shelljs')
const basePath = process.cwd()

const buildWin = () => {
  return new Promise((resolve, reject) => {
    shell.exec(
      `electron-builder -w=nsis --x64 --ia32 --config ./script/build/config/window.js `,
      (code, stdout) => {
        if (code !== 0) {
          reject('打包win失败')
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
      log.info('处于mac环境,同时打包mac和win')
      buildWin()
      return
    } else if (platform === 'win32') {
      log.info('处于win环境,只打包win')
      return
    } else if (platform === 'linux') {
      log.info('处于linux环境,只打包linux')
      return
    }
  })
}
