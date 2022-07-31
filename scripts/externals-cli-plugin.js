/**
 *  插件是为了设置externals的，	并且将指定的js复制到对应的目录，并动态引用，以此来压缩打包的面积
 * 使用方法：在项目根目录下新建一个externals.js文件，解析动态的顺序是从开始到结束，若是有向上依赖，应该放到前面，内容如下：
 * module.exports = {
		xgplayer: {
			pkgPath: '/node_modules/xgplayer',// 包的地址，有这个属性，就会将包的文件复制到对应的目录，并动态引用，加上版本号
			filePath: 'dist', // 文件地
			fileName: 'index.js', // 要复制的文件名
			newFileName: 'xgplayer.js', // 若是有新的文件名，就会将文件名改为这个
			root: 'xgplayer' // externals的名称，要有root才会增加external的配置，当然可以增加externals的其他属性，比如commmonjs2 amd root等
		},
 * }
 */
const path = require('path')
const fs = require('fs')
const { warn } = require('@vue/cli-shared-utils')
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin')
const CWD = process.cwd() || process.env.INIT_CWD
const externals = require(path.join(CWD, './.externals.js'))

module.exports = (api) => {
	api.chainWebpack((webpackConf) => {
		const externalsConf = {}
		Object.entries(externals || {}).forEach(([key, conf]) => {
			const newConf = {
				needCopy: false
			}
			if (conf.root) {
				Object.assign(newConf, {
					commonjs: conf.commonjs || key,
					commonjs2: conf.commonjs2 || key,
					amd: conf.amd || key,
					root: conf.root || key
				})
			}
			if (conf.pkgPath) {
				const pkgJsonPath = path.join(CWD, conf.pkgPath, 'package.json')
				if (!fs.existsSync(pkgJsonPath)) {
					warn(`\nexternals:${key} package.json not found`)
					return
				}
				const pkgJson = require(pkgJsonPath)
				newConf.pkgVersion = pkgJson.version
				newConf.copyFilePath = path.join(
					CWD,
					conf.pkgPath,
					conf.filePath,
					conf.fileName
				)
				newConf.extension = path.extname(conf.fileName)
				newConf.fileName = conf.fileName
				newConf.needCopy = true
			}
			externalsConf[key] = Object.assign(conf, newConf)
		})

		const newExternals = {}
		Object.entries(externalsConf).map(([key, conf]) => {
			if (conf.root) {
				newExternals[key] = conf
			}
		})

		// 配置externals
		webpackConf.externals(newExternals)

		const copyFiles = Object.values(externalsConf)
			.filter((conf) => conf.needCopy)
			.map((conf) => {
				return {
					extension: conf.extension,
					version: conf.pkgVersion,
					from: conf.copyFilePath,
					to: `${conf.extension.split('.')[1]}/${
						conf.newFileName || conf.fileName
					}`
				}
			})
		// 配置copy
		webpackConf.plugin('copy').tap((args) => {
			const _copyFiles = copyFiles.map(({ from, to }) => ({ from, to }))
			args[0].patterns = args[0].patterns.concat(_copyFiles)
			return args
		})

		// 查询css
		const links = copyFiles
			.filter((conf) => conf.extension === '.css')
			.map((file) => `${file.to}?v=${file.version}`)

		// 查询script
		const scripts = copyFiles
			.filter((conf) => conf.extension === '.js')
			.map((file) => `${file.to}?v=${file.version}`)

		// 配置css & script 的连接
		webpackConf
			.plugin('html-tags')
			.after('html')
			.use(HtmlWebpackTagsPlugin, [
				{
					append: false,
					links: links,
					scripts: scripts
				}
			])
	})
}
