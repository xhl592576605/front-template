import Core from 'native/core'

const MainWindowSymbol = Symbol('electron#mainWindow')

export default (core: Core) => {
  const getMainWindow = () => {}
  return {
    getMainWindow
  }
}
