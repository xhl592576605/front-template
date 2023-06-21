import { CorePlugin } from '../plugins/corePlugin'

/**
 * core option
 */
export interface CoreOptions extends Options {
  env: 'dev' | 'devp' | 'develop' | 'development' | 'prod' | 'production'
  platform: Platform
  arch: Architecture,
  mac: string
  ip: string,
  baseDir: string
  homeDir: string
  appName: string
  appVersion: string
  userHome: string
  appData: string
  appUserData: string
  temp: string
  logs: string
  crashDumps: string
  isPackaged: boolean
  execDir: string
}
export interface Options {
  [key: string]: any
  plugins?: CorePlugin[]
}

type Platform =
  | 'aix'
  | 'android'
  | 'darwin'
  | 'freebsd'
  | 'haiku'
  | 'linux'
  | 'openbsd'
  | 'sunos'
  | 'win32'
  | 'cygwin'
  | 'netbsd'
type Architecture =
  | 'arm'
  | 'arm64'
  | 'ia32'
  | 'mips'
  | 'mipsel'
  | 'ppc'
  | 'ppc64'
  | 's390'
  | 's390x'
  | 'x64'
