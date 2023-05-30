// import { app, dialog } from 'electron'
import fs from 'fs'
import is from 'is-type-of'

export default (fullPath: string, ...inject: any) => {
  if (!fs.existsSync(fullPath)) return null
  let obj = require(fullPath)

  if (!obj) return obj
  // it's es module
  if (obj.__esModule && 'default' in obj) obj = obj.default
  // it's function
  if (is.function(obj) && !is.class(obj)) return obj(...inject)

  return obj
}
