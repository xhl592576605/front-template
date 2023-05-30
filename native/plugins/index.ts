import CoreConfigPlugin from './coreConfigPlugin'
import CoreLoggerPlugin from './coreLoggerPlugin'
import CoreMainWindowPlugin from './coreMainWindowPlugin'
import { CorePlugin } from './corePlugin'

export default [
  new CoreConfigPlugin(),
  new CoreLoggerPlugin(),
  new CoreMainWindowPlugin()
]
export { CorePlugin }
