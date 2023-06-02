export const isPackaged = () => {
  return process.env.ELECTRON_IS_PACKAGED === 'true'
}

/**
 * 是否为开发环境
 */
export const isDev = () => {
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'develop' ||
    process.env.NODE_ENV === 'devp' ||
    process.env.NODE_ENV === 'dev' ||
    process.env.NODE_ENV === 'local'
  )
}

/**
 * 是否生产环境
 */
export const isProd = () => {
  return (
    process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production'
  )
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
 * 主服务页面是否为开发环境
 * @returns
 */
export const isMainServerDev = () => {
  return (
    process.env.ELECTRON_MAIN_SERVER_ENV === 'dev' ||
    process.env.ELECTRON_MAIN_SERVER_ENV === 'devp' ||
    process.env.ELECTRON_MAIN_SERVER_ENV === 'develop' ||
    process.env.ELECTRON_MAIN_SERVER_ENV === 'development'
  )
}

/**
 * 主服务页面是否为测试环境
 * @returns
 */
export const isMainServerTest = () => {
  return process.env.ELECTRON_MAIN_SERVER_ENV === 'test'
}

/**
 * 主服务页面是否为预发环境
 * @returns
 */
export const isMainServerPre = () => {
  return process.env.ELECTRON_MAIN_SERVER_ENV === 'pre'
}

/**
 * 主服务页面是否为生产环境
 * @returns
 */
export const isMainServerProd = () => {
  return (
    process.env.ELECTRON_MAIN_SERVER_ENV === 'prod' ||
    process.env.ELECTRON_MAIN_SERVER_ENV === 'production'
  )
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
