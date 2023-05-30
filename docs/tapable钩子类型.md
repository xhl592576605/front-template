### Hook 类型可分为同步Sync和异步Async,异步又分为并行和串行

-  SyncHook
   -  所有的构造函数都接收一个可选参数，参数是一个参数名的字符串数组
   - 参数的名字可以任意填写，但是参数数组的长度必须要跟实际接受的参数个数一致
   - 如果回调函数不接受参数，可以传入空数组
   - 在实例化的时候传入的数组长度长度有用，值没有用途
   - 执行 call 时，参数个数和实例化时的数组长度有关
   - 回调的时候是按先入先出的顺序执行的，先放的先执行

- SyncWaterfallHook
  - SyncWaterfallHook 表示如果上一个回调函数的结果不为 undefined,则可以作为下一个回调函数的第一个参数
  - 回调函数的参数来自上一个函数的结果
  - 调用 call 传入的第一个参数，会被上一个函数的非 undefined 结果替换
  - 当回调函数返回非 undefined 不会停止回调栈的调用

- SyncLoopHook
  - SyncLoopHook 的特点是不停的循环执行回调函数，直到函数结果等于 undefined
  - 要注意的是每次循环都是从头开始循环的

- AsyncParallelHook
  - 异步并行执行钩子

- AsyncParallelBailHook
  - 带保险的异步并行执行钩子
  - 有一个任务返回值不为空就直接结束

- AsyncSeriesHook
  - 异步串行钩子
  - 任务一个一个执行，执行完上一个执行下一个

- AsyncSeriesBailHook
  - 只要有一个返回了不为 undefined 的值就直接结束

- AsyncSeriesWaterfall
  - 只要有一个返回了不为 undefined 的值就直接结束


资料：https://zhoubichuan.gitee.io/web-webpack/senior/tapable/1.index.html
