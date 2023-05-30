const { version } = require('../../../package.json')

module.exports = {
  productName: 'hans',
  appId: 'com.electron.hans',
  copyright: 'Copyright © 2011-' + new Date().getFullYear() + ' HANS',
  directories: {
    output: `builder-out/${version}/${process.platform}`
  },
  asar: true,
  files: [
    '**/*',
    '!frontend/',
    '!logs/**/*',
    '!frontend/**/*',
    '!builder-out/**/*',
    '!.husky/**/*',
    '!script/**/*',
    '!docs/**/*',
    'public/**/*'
  ],
  extraResources: {
    from: './build/extraResources/',
    to: 'extraResources'
  },
  electronDownload: {
    mirror: 'https://npmmirror.com/mirrors/electron/'
  },
  publish: [
    {
      provider: 'generic',
      url: 'https://baidu.com/'
    }
  ]
}
