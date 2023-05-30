import { BrowserWindow, Menu } from 'electron'
import Core from '../core'
let mainWindow: BrowserWindow | null = null

export default (core: Core) => {
  const createWindow = () => {
    const {
      option: windowOption,
      openAppMenu,
      openDevTools
    } = core.config.mainWindow

    const win = new BrowserWindow(windowOption)

    // 开发工具
    const { isPackaged } = core.options
    if (!isPackaged && openDevTools) {
      win.webContents.openDevTools({
        mode: 'undocked',
        activate: false
      })
    }

    // 菜单显隐
    if (openAppMenu === false) {
      Menu.setApplicationMenu(null)
    }
    return win
  }

  const getMainWindow = () => {
    if (!mainWindow) {
      mainWindow = createWindow()
    }
    return mainWindow
  }

  return {
    getMainWindow
  }
}
