import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('WebViewJavascriptBridge', {
  /**
   * 注册渲染进程事件（回调函数方式）
   * @param key
   * @param callBack
   */
  registerHandler: (key: string, callBack: () => void) => {},
  /**
   * 触发事件，默认主进程，所有渲染进程接收，可以加个枚举参数指定（回调函数方式）
   * @param key
   * @param params
   * @param callBack
   */
  callHandler: (key: string, params: any, callBack: () => void) => {},
  /**
   * 注册渲染进程事件（异步方式）
   * @param key
   * @param callBack
   */
  tapPromise: (key: string, callBack: () => void) => {},
  /**
   * 触发事件，默认主进程，所有渲染进程接收，可以加个枚举参数指定（异步方式）
   * @param key
   * @param params
   */
  promise: (key: string, ...params: any) => {},

  /**
   * 渲染进程可以监听的所有key值
   */
  TAP_KEYS: {},
  /**主进程暴露出的所有key值 */
  PROMISE_KEY: {}
})
