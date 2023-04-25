const baseInfo = require('./base')
const { version } = require('../../../package.json')

module.exports = {
  ...baseInfo,
  directories: {
    output: `builder-out/${version}/windows`
  },
  nsis: {
    oneClick: false,
    allowElevation: true,
    allowToChangeInstallationDirectory: true,
    installerIcon: './build/icons/icon.ico',
    uninstallerIcon: './build/icons/icon.ico',
    installerHeaderIcon: './build/icons/icon.ico',
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: 'HANS'
  },
  win: {
    icon: './build/icons/icon.ico',
    artifactName: '${productName}-${os}-${version}-${arch}.${ext}',
    target: [
      {
        target: 'nsis'
      }
    ]
  }
}
