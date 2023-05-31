import {
  BeforeSendResponse,
  CallbackResponse,
  HeadersReceivedResponse,
  NotificationResponse,
  OnBeforeRedirectListenerDetails,
  OnBeforeRequestListenerDetails,
  OnBeforeSendHeadersListenerDetails,
  OnCompletedListenerDetails,
  OnErrorOccurredListenerDetails,
  OnHeadersReceivedListenerDetails,
  OnResponseStartedListenerDetails,
  OnSendHeadersListenerDetails
} from 'electron'
import {
  AsyncSeriesHook,
  AsyncSeriesWaterfallHook,
  SyncHook,
  SyncWaterfallHook
} from 'tapable'
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
  awaitAppSecondInstance: AsyncSeriesHook<[Core, Electron.Event]>
  awaitAppWindowAllClosed: AsyncSeriesHook<Core>
  awaitAppReady: AsyncSeriesHook<
    [Core, Electron.Event, Record<string, any> | NotificationResponse]
  >
  awaitAppActivate: AsyncSeriesHook<[Core, Electron.Event, boolean]>

  beforeAppQuit: SyncHook<Core>
  beforeAppRelaunch: SyncHook<Core>

  // webRequest钩子
  awaitWebRequestOnBeforeRequest: AsyncSeriesWaterfallHook<
    [CallbackResponse, OnBeforeRequestListenerDetails, Core]
  >
  awaitWebRequestOnBeforeSendHeaders: AsyncSeriesWaterfallHook<
    [BeforeSendResponse, OnBeforeSendHeadersListenerDetails, Core]
  >
  awaitWebRequestOnSendHeaders: AsyncSeriesHook<
    [OnSendHeadersListenerDetails, Core]
  >
  awaitWebRequestOnHeadersReceived: AsyncSeriesWaterfallHook<
    [HeadersReceivedResponse, OnHeadersReceivedListenerDetails, Core]
  >
  awaitWebRequestOnResponseStarted: AsyncSeriesHook<
    [OnResponseStartedListenerDetails, Core]
  >
  awaitWebRequestOnBeforeRedirect: AsyncSeriesHook<
    [OnBeforeRedirectListenerDetails, Core]
  >
  awaitWebRequestOnCompleted: AsyncSeriesHook<
    [OnCompletedListenerDetails, Core]
  >
  awaitWebRequestOnErrorOccurred: AsyncSeriesHook<
    [OnErrorOccurredListenerDetails, Core]
  >

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

    this.awaitWebRequestOnBeforeRequest = new AsyncSeriesWaterfallHook([
      'callbackResponse',
      'core',
      'details'
    ])
    this.awaitWebRequestOnBeforeSendHeaders = new AsyncSeriesWaterfallHook([
      'beforeSendResponse',
      'details',
      'core'
    ])
    this.awaitWebRequestOnSendHeaders = new AsyncSeriesHook(['details', 'core'])
    this.awaitWebRequestOnHeadersReceived = new AsyncSeriesWaterfallHook([
      'headersReceivedResponse',
      'details',
      'core'
    ])
    this.awaitWebRequestOnResponseStarted = new AsyncSeriesHook([
      'details',
      'core'
    ])
    this.awaitWebRequestOnBeforeRedirect = new AsyncSeriesHook([
      'details',
      'core'
    ])
    this.awaitWebRequestOnCompleted = new AsyncSeriesHook(['details', 'core'])
    this.awaitWebRequestOnErrorOccurred = new AsyncSeriesHook([
      'details',
      'core'
    ])
  }
}
