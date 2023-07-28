import CoreAutoUpdatePlugin from './coreAutoUpdatePlugin'
import CoreConfigPlugin from './coreConfigPlugin'
import CoreIpcPlugin from './coreIpcPlugin'
import CoreLoggerPlugin from './coreLoggerPlugin'
import CoreMainWindowPlugin from './coreMainWindowPlugin'
import { CorePlugin } from './corePlugin'

export default [
  new CoreConfigPlugin(),
  new CoreLoggerPlugin(),
  new CoreIpcPlugin(),
  new CoreMainWindowPlugin(),
  new CoreAutoUpdatePlugin()
]
export { CorePlugin }
