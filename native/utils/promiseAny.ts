/**
 * es6 没有Promise.any方法，所以自己实现一个
 */
export default (promises: any) => {
  return new Promise((resolve, reject) => {
    promises = Array.isArray(promises) ? promises : []
    let len = promises.length
    // 用于收集所有 reject
    const errs: any = []
    // 如果传入的是一个空数组，那么就直接返回 AggregateError
    if (len === 0) return reject(new Error('All promises were rejected'))
    promises.forEach((promise: any) => {
      promise.then(
        (value: any) => {
          resolve(value)
        },
        (err: any) => {
          len--
          errs.push(err)
          if (len === 0) {
            reject(new Error(errs))
          }
        }
      )
    })
  })
}
