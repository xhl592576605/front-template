import { CorePlugin } from './core-plugin'
import CoreConfigPlugin from './core-config-plugin'
import CoreLoggerPlugin from './core-logger-plugin'
import CoreMainWindowPlugin from './core-mainWindow-plugin'

export default [
  new CoreConfigPlugin(),
  new CoreLoggerPlugin(),
  new CoreMainWindowPlugin()
]
export { CorePlugin }
