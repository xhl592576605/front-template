export const isPackaged = () => {
  return process.env.ELECTRON_IS_PACKAGED === 'true'
}

/**
 * 是否为开发环境
 */
export const isDev = () => {
  if (
    process.env.EE_SERVER_ENV === 'development' ||
    process.env.EE_SERVER_ENV === 'dev' ||
    process.env.EE_SERVER_ENV === 'local'
  ) {
    return true
  }

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'dev' ||
    process.env.NODE_ENV === 'local'
  ) {
    return true
  }

  return false
}

/**
 * 是否为渲染进程
 */
export const isRenderer = () => {
  return (
    typeof process === 'undefined' || !process || process.type === 'renderer'
  )
}

/**
 * 是否为主进程
 */
export const isMain = () => {
  return typeof process !== 'undefined' && process.type === 'browser'
}

/**
 * 是否为node子进程
 */
export const isForkedChild = () => {
  return Number(process.env.ELECTRON_RUN_AS_NODE) === 1
}

/**
 * 当前进程类型
 */
export const processType = () => {
  let type = ''
  if (isMain()) {
    type = 'browser'
  } else if (isRenderer()) {
    type = 'renderer'
  } else if (isForkedChild()) {
    type = 'child'
  }

  return type
}
