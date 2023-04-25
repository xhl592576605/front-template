const log = require('../log')

module.exports = () => {
  return new Promise((resolve, reject) => {
    log.info('开始打包electron')
    log.info('结束打包electron')
  })
}
