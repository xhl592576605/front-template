import { BrowserWindow } from 'electron'

const MainWindowSymbol = Symbol('electron#mainWindow')

const MainWindow: Record<symbol | string, any> = {
  /**
   * 获取 mainWindow
   */
  getMainWindow(): BrowserWindow | null {
    if (!this[MainWindowSymbol]) {
      this[MainWindowSymbol] = new BrowserWindow()
    }

    return this[MainWindowSymbol] || null
  },

  /**
   * extra
   */
  extra: {
    closeWindow: false
  }
}

export default MainWindow
