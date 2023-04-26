import { SyncWaterfallHook } from 'tapable'
import { Options } from '../../types/core-options'

export default class Hooks {
  beforeMergeOption: SyncWaterfallHook<Options>
  beforeGetConfig: SyncWaterfallHook<any>
  awaitGetConfig: SyncWaterfallHook<any>
  afterGetConfig: SyncWaterfallHook<any>
  constructor() {
    this.beforeMergeOption = new SyncWaterfallHook(['option'])
    this.beforeGetConfig = new SyncWaterfallHook(['config'])
    this.awaitGetConfig = new SyncWaterfallHook(['config'])
    this.afterGetConfig = new SyncWaterfallHook(['config'])
  }
}
