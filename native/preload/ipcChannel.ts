/**
 * 针对渲染进程=>主进程监听的channel类型
 */
export const IpcMainChannel = {
  CHECK_JS_IPC: 'check-js-ipc',
  Core: {
    GET_CONFIG: 'core:get-config',
    GET_OPTIONS: ' core:get-options',
    CHANGE_MAIN_SERVER_ENV: 'core:change-main-server-env'
  },
  App: {
    QUIT: 'app:quit',
    RELAUNCH: 'app:relaunch',
    MAXIMIZE: 'app:maximize',
    MINIMIZE: 'app:minimize',
    FULLSCREEN: 'app:fullscreen',
    CLOSE: 'app:close',
    RESTORE_MAIN_WINDOW: 'app:restore-main-window'
  }
}

/**
 * 针对主进程=>渲染进程兼容的channel类型
 */
export const IpcWebContentChannel = {
  App: {
    NET_STATUS: 'app:net-status'
  }
}
