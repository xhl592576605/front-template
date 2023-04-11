import Core from 'native/core'
import { AppConfig, DevelopmentMode } from '../types/config'

export default (core: Core) => {
	const config: AppConfig = {
		homeDir: core.option.homeDir,
		developmentMode: {
			default: DevelopmentMode.vue,
			mode: {
				vue: {
					hostname: 'localhost',
					port: 3000
				},
				react: {
					hostname: 'localhost',
					port: 3000
				},
				html: {
					hostname: 'localhost',
					indexPage: 'index.html'
				}
			}
		}
	}

	/**
	 * 主进程
	 */
	config.mainServer = {
		protocol:'http://',
		host: 'localhost',
		port: 7072
		}

	return {
		...config
	}
}
