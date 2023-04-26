const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const { ncp } = require('ncp')
const CWD = process.cwd() || process.env.INIT_CWD

const publicDir = path.join(CWD, 'out', 'public', 'dist')
const frontendDistDir = path.join(CWD, 'frontend', 'dist')
const mkdir = promisify(fs.mkdir)
const copy = promisify(ncp)
async function main() {
  try {
    await mkdir(publicDir, {
      recursive: true
    })
  } catch (error) {
    if (error.code !== 'EEXIST') {
      console.info(` ${publicDir} already exists`)
    }
  }

  try {
    await copy(frontendDistDir, publicDir)
    console.log(`Successfully copied ${frontendDistDir} to ${publicDir}`)
  } catch (error) {
    console.error(
      `Failed to copy ${frontendDistDir} to ${publicDir}: ${error.message}`
    )
  }
}
main()
