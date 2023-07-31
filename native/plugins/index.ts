import CoreAutoUpdatePlugin from './coreAutoUpdatePlugin'
import CoreConfigPlugin from './coreConfigPlugin'
import CoreIpcPlugin from './coreIpcPlugin'
import CoreLoggerPlugin from './coreLoggerPlugin'
import CoreMainWindowPlugin from './coreMainWindowPlugin'
import { CorePlugin } from './corePlugin'
import CoreSettingPlugin from './coreSettingPlugin'

export default [
  new CoreConfigPlugin(),
  new CoreLoggerPlugin(),
  new CoreIpcPlugin(),
  new CoreMainWindowPlugin(),
  new CoreAutoUpdatePlugin(false),
  new CoreSettingPlugin()
]
export { CorePlugin }
