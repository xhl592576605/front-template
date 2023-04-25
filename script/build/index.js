const log = require('../log')
const builder = require('electron-builder')
const builderConfig = require('./config/electron-builder')

module.exports = () => {
  return new Promise((resolve, reject) => {
    log.info('开始打包electron')
    builder
      .build({
        targets: builder.Platform.WINDOWS.createTarget(),
        win: ['nsis'],
        x64: true,
        config: builderConfig
      })
      .then(resolve)
      .catch((err) => reject(err))
      .finally(() => {
        log.info('结束打包electron')
      })
  })
}
