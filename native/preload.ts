import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  showMessage: () => {
    alert('message')
  }
})
