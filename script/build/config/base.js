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
    '!.config/**/*',
    '!logs/**/*',
    '!frontend/**/*',
    '!builder-out/**/*',
    '!.husky/**/*',
    '!script/**/*',
    '!docs/**/*',
    '!native/**/*',
    '!.npmrc',
    '!README.md',
    '!package-lock.json',
    '!pnpm-lock.yaml',
    '!pnpm-workspace.yaml',
    '!yarn.lock',
    '!tsconfig.json',
    '!.eslintrc.js',
    '!.prettierrc.js',
    '!commitlint.config.cjs',
    '!dev-app-update.yml',
    '!.cz-config.js'
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
