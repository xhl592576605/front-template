export const isPackaged = () => {
  return process.env.ELECTRON_IS_PACKAGED === 'true'
}
