const baseInfo = require('./base')
module.exports = {
  ...baseInfo,
  linux: {
    icon: './build/icons/icon.icns',
    artifactName: '${productName}-${os}-${version}-${arch}.${ext}',
    target: ['deb'],
    category: 'Utility'
  }
}
