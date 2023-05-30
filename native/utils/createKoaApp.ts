import fs from 'fs'
import { Server as HttpServer } from 'http'
import https, { Server as HttpsServer } from 'https'
import Koa from 'koa'
import KoaStatic, { Options as KoaStaticOption } from 'koa-static'
import historyApiFallback from 'koa2-connect-history-api-fallback'
import KoaCors from 'koa2-cors'

/**
 * 创建koa应用
 * @param staticDir 静态文件目录
 * @param port 端口
 * @param protocol 协议
 * @param ssl ssl证书
 * @param koaOption koa配置
 * @param koaStaticOption koa-static配置
 * @returns Koa实例 和 HttpServer实例
 */
export default (
  staticDir: string,
  port: number,
  protocol?: string,
  ssl?: {
    key: string
    cert: string
  },
  koaOption: any = {},
  koaStaticOption?: KoaStaticOption
) => {
  return new Promise<{ server: HttpsServer | HttpServer; app: Koa }>(
    (resolve, reject) => {
      try {
        const app = new Koa(koaOption)
        app
          .use(historyApiFallback())
          .use(KoaCors())
          .use(
            KoaStatic(
              staticDir,
              koaStaticOption || {
                maxAge: 24 * 60 * 60 * 1000,
                gzip: true
              }
            )
          )
        const isHttps = protocol == 'https://'
        if (isHttps && ssl) {
          const sslOpt = {
            key: fs.readFileSync(ssl.key, 'utf-8'),
            cert: fs.readFileSync(ssl.cert, 'utf-8')
          }
          const httpsServer = https.createServer(sslOpt, app.callback())
          httpsServer.listen(port, () => {
            resolve({ server: httpsServer, app })
          })
          httpsServer.addListener('error', (err) => reject(err))
          return
        } else {
          const httpsServer = app.listen(port, () => {
            resolve({ server: httpsServer, app })
          })
          httpsServer.addListener('error', (err) => {
            reject(err)
          })
        }
      } catch (e) {
        reject(e)
      }
    }
  )
}
