const baseInfo = require('./base')
const { version } = require('../../../package.json')

module.exports = {
  ...baseInfo,
  directories: {
    output: `builder-out/${version}/${process.platform}`
  },
  mac: {
    electronLanguages: ['zh_CN', 'en'],
    icon: './build/icons/icon.icns',
    artifactName: '${productName}-${os}-${version}-${arch}.${ext}',
    target: ['dmg', 'zip'],
    extendInfo: {
      NSMicrophoneUsageDescription: '请允许本程序访问您的麦克风',
      NSCameraUsageDescription: '请允许本程序访问您的摄像头'
    }
  }
}
