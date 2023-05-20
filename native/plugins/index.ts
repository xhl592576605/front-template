import CoreConfigPlugin from './core-config-plugin'
import CoreLoggerPlugin from './core-logger-plugin'
import CoreMainWindowPlugin from './core-mainWindow-plugin'
import { CorePlugin } from './core-plugin'

export default [
  new CoreConfigPlugin(),
  new CoreLoggerPlugin(),
  new CoreMainWindowPlugin()
]
export { CorePlugin }
