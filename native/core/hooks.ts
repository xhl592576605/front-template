import { SyncHook, SyncWaterfallHook, AsyncSeriesHook } from 'tapable'
import { Options } from '../types/core-options'
import Core from '.'

export default class Hooks {
  // 合并option之前
  beforeMergeOption: SyncWaterfallHook<Options>

  // config钩子
  beforeGetConfig: SyncHook<Core>
  awaitGetConfig: AsyncSeriesHook<Core>
  afterGetConfig: SyncHook<Core>

  // logger钩子
  beforeInitLogger: SyncHook<Core>
  awaitInitLogger: AsyncSeriesHook<Core>
  afterInitLogger: SyncHook<Core>

  // 初始化应用
  beforeInitApp: SyncHook<Core>
  awaitInitApp: AsyncSeriesHook<Core>
  afterInitApp: SyncHook<Core>

  // 初始化窗口
  beforeCreateMainWindow: SyncHook<Core>
  awaitCreateMainWindow: AsyncSeriesHook<Core>
  afterCreateMainWindow: SyncHook<Core>

  constructor() {
    this.beforeMergeOption = new SyncWaterfallHook(['option'])

    this.beforeGetConfig = new SyncHook(['core'])
    this.awaitGetConfig = new AsyncSeriesHook(['core'])
    this.afterGetConfig = new SyncHook(['core'])

    this.beforeInitLogger = new SyncHook(['core'])
    this.awaitInitLogger = new AsyncSeriesHook(['core'])
    this.afterInitLogger = new SyncHook(['core'])

    this.beforeInitApp = new SyncHook(['core'])
    this.awaitInitApp = new AsyncSeriesHook(['core'])
    this.afterInitApp = new SyncHook(['core'])

    this.beforeCreateMainWindow = new SyncHook(['core'])
    this.awaitCreateMainWindow = new AsyncSeriesHook(['core'])
    this.afterCreateMainWindow = new SyncHook(['core'])
  }
}
