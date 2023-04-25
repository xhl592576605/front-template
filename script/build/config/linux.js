const baseInfo = require('./base')
const { version } = require('../../../package.json')

module.exports = {
  ...baseInfo,
  directories: {
    output: `builder-out/${version}/${process.platform}`
  },
  linux: {
    icon: './build/icons/icon.icns',
    artifactName: '${productName}-${os}-${version}-${arch}.${ext}',
    target: ['deb'],
    category: 'Utility'
  }
}
