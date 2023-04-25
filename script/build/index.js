const log = require('../log')
const builder = require('electron-builder')
const builderConfig = require('./config/electron-builder')

module.exports = () => {
  return new Promise((resolve, reject) => {
    log.info('开始打包electron')
    // 使用electron-builder打包
    builder
      .build({
        x64: true,
        win: ['nsis'],
        config: builderConfig
      })
      .then(() => {
        log.success('electron打包成功')
        resolve()
      })
      .catch((err) => {
        log.error('electron打包失败: ' + err.message)
        reject(err)
      })
  })
}
