import { CorePlugin } from './core-plugin'
import CoreConfigPlugin from './core-config-plugin'
import CoreLoggerPlugin from './core-logger-plugin'

export default [new CoreConfigPlugin(), new CoreLoggerPlugin()]
export { CorePlugin }
