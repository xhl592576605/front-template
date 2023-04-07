module.exports = {
	productName: 'hans',
	appId: 'com.electron.hans',
	copyright: 'HANS',
	directories: {
		output: 'builder-out'
	},
	asar: true,
	files: ['**/*', '!frontend/', '!logs/', '!electron/'],
	extraResources: {
		from: './build/extraResources/',
		to: 'extraResources'
	},
	electronDownload: {
		mirror: 'https://npmmirror.com/mirrors/electron/'
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
	publish: [
		{
			provider: 'generic',
			url: 'https://baidu.com/'
		}
	],
	mac: {
		icon: './build/icons/icon.icns',
		artifactName: '${productName}-${os}-${version}-${arch}.${ext}',
		target: ['dmg', 'zip']
	},
	win: {
		icon: './build/icons/icon.ico',
		artifactName: '${productName}-${os}-${version}-${arch}.${ext}',
		target: [
			{
				target: 'nsis'
			}
		]
	},
	linux: {
		icon: './build/icons/icon.icns',
		artifactName: '${productName}-${os}-${version}-${arch}.${ext}',
		target: ['deb'],
		category: 'Utility'
	}
}
