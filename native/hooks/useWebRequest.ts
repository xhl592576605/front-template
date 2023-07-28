import {
  BeforeSendResponse,
  CallbackResponse,
  HeadersReceivedResponse,
  session
} from 'electron'
import Core from '../core'

export default (core: Core) => {
  /**
   * 注册webRequest拦截，并触发各处注册的钩子
   */
  const registerWebRequestIntercept = () => {
    session.defaultSession.webRequest.onBeforeRequest(
      async (details, callback) => {
        const callbackResponse: CallbackResponse = {
          cancel: false,
          redirectURL: undefined
        }
        const res = await core.lifeCycle.awaitWebRequestOnBeforeRequest.promise(
          callbackResponse,
          details,
          core
        )
        if (!res || (res.cancel && res.redirectURL)) {
          callback({
            cancel: false
          })
          return
        }
        callback(res)
      }
    )

    session.defaultSession.webRequest.onBeforeSendHeaders(
      async (details, callback) => {
        const beforeSendResponse: BeforeSendResponse = {
          cancel: false,
          requestHeaders: details.requestHeaders
        }
        const res =
          await core.lifeCycle.awaitWebRequestOnBeforeSendHeaders.promise(
            beforeSendResponse,
            details,
            core
          )
        if (!res || (res.cancel && res.requestHeaders)) {
          callback({
            cancel: false,
            requestHeaders: details.requestHeaders
          })
          return
        }
        callback(res)
      }
    )

    session.defaultSession.webRequest.onSendHeaders(async (details) => {
      await core.lifeCycle.awaitWebRequestOnSendHeaders.promise(details, core)
    })

    session.defaultSession.webRequest.onHeadersReceived(
      async (details, callback) => {
        const headersReceivedResponse: HeadersReceivedResponse = {
          cancel: false,
          responseHeaders: details.responseHeaders
        }
        const res =
          await core.lifeCycle.awaitWebRequestOnHeadersReceived.promise(
            headersReceivedResponse,
            details,
            core
          )
        if (!res || (res.cancel && res.responseHeaders)) {
          callback({
            cancel: false,
            responseHeaders: details.responseHeaders
          })
          return
        }
        callback(res)
      }
    )

    session.defaultSession.webRequest.onResponseStarted(async (details) => {
      await core.lifeCycle.awaitWebRequestOnResponseStarted.promise(
        details,
        core
      )
    })

    session.defaultSession.webRequest.onBeforeRedirect(async (details) => {
      await core.lifeCycle.awaitWebRequestOnBeforeRedirect.promise(
        details,
        core
      )
    })

    session.defaultSession.webRequest.onCompleted(async (details) => {
      await core.lifeCycle.awaitWebRequestOnCompleted.promise(details, core)
    })

    session.defaultSession.webRequest.onErrorOccurred(async (details) => {
      await core.lifeCycle.awaitWebRequestOnErrorOccurred.promise(details, core)
    })
  }

  return {
    registerWebRequestIntercept
  }
}
