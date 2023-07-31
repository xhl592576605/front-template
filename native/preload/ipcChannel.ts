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
    RESTORE_MAIN_WINDOW: 'app:restore-main-window',
    GET_SETTING: 'app:get-setting',
    CHANGE_SETTING: 'app:change-setting',
    GET_SOUND_OUTPUT_DELAY_TIME: 'app:get-sound-output-delay-time'
  },
  AutoUpdate: {
    CHECK_UPDATES: 'auto-update:check-updates',
    DOWNLOAD_UPDATE: 'auto-update:download-update',
    INSTALL_UPDATE: 'auto-update:install-update'
  }
}

/**
 * 针对主进程=>渲染进程兼容的channel类型
 */
export const IpcWebContentChannel = {
  App: {
    NET_STATUS: 'app:net-status'
  },
  AutoUpdate: {
    ERROR: 'auto-update:error',
    CHECKING_FOR_UPDATE: 'auto-update:checking-for-update',
    UPDATE_AVAILABLE: 'auto-update:update-available',
    UPDATE_NOT_AVAILABLE: 'auto-update:update-not-available',
    DOWNLOAD_PROGRESS: 'auto-update:download-progress',
    UPDATE_DOWNLOADED: 'auto-update:update-downloaded',
    UPDATE_CANCELLED: 'auto-update:update-cancelled',
    CAN_INSTALL_UPDATE: 'auto-update:can-install-update'
  }
}
