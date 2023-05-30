import { NotificationResponse } from 'electron'
import { AsyncSeriesHook, SyncHook, SyncWaterfallHook } from 'tapable'
import Core from '.'
import { Options } from '../types/coreOptions'
export default class LifeCycle {
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

  // electron-app的钩子
  awaitAppSecondInstance: AsyncSeriesHook<Core_ElectronEvent_Args>
  awaitAppWindowAllClosed: AsyncSeriesHook<Core>
  awaitAppReady: AsyncSeriesHook<Core_ElectronEvent_LaunchInfo_Args>
  awaitAppActivate: AsyncSeriesHook<Core_ElectronEvent_HasVisibleWindows_Args>

  beforeAppQuit: SyncHook<Core>
  beforeAppRelaunch: SyncHook<Core>

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

    this.awaitAppSecondInstance = new AsyncSeriesHook(['core', 'event'])
    this.awaitAppWindowAllClosed = new AsyncSeriesHook(['core'])
    this.awaitAppReady = new AsyncSeriesHook(['core', 'event', 'launchInfo'])
    this.awaitAppActivate = new AsyncSeriesHook([
      'core',
      'event',
      'hasVisibleWindows'
    ])

    this.beforeAppQuit = new SyncHook(['core'])
    this.beforeAppRelaunch = new SyncHook(['core'])
  }
}

export type Core_ElectronEvent_Args = [Core, Electron.Event]
export type Core_ElectronEvent_LaunchInfo_Args = [
  Core,
  Electron.Event,
  Record<string, any> | NotificationResponse
]
export type Core_ElectronEvent_HasVisibleWindows_Args = [
  Core,
  Electron.Event,
  boolean
]
