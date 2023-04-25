const baseInfo = require('./base')

module.exports = {
  ...baseInfo,
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
