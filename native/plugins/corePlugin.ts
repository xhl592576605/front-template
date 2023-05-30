import Core from '../core'

export abstract class CorePlugin {
  abstract name: string
  abstract apply: ($core: Core) => void
}
