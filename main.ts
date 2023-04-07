import path from 'path'
import { app, BrowserWindow } from 'electron'
app.whenReady().then(() => {
	const mainWindow = new BrowserWindow({
		webPreferences: {
			preload: path.join(__dirname, 'electron/preload.js')
		}
	})
	mainWindow.loadFile(path.join(__dirname, '../public/index.html'))
})
