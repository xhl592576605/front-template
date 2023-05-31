# electron-senior
一个将electron原生与网页分开的electron框架
> 拷贝该项目，需要自行替换打包配置文件内容，与打包资源文件夹的内容

# 软件使用pnpm作为包源管理
- 官网：https://pnpm.io/zh/motivation
- 安装
    ``` bash
    npm install -g pnpm
    ```

## 目录
``` bash
├── README.md # 说明
├── build # 打包资源文件夹
│   └── icons
├── builder-out # 打包输出文件夹
├── frontend # 前端页面文件夹，可以任意框架
├── main.ts # electron主入口
├── native # electron原生的功能
│   ├── config
│   ├── core
│   ├── index.ts
│   ├── main-window
│   ├── preload.ts
│   └── types
├── out # native编译出来的结果
│   ├── main.js
│   ├── main.js.map
│   ├── native
│   └── public # 将frontend编译好的项目复制到的目录，存在正式的前端页面
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── public # 静态页面 暂时无用
│   └── index.html
├── script # 打包electron脚本
│   ├── build
│   ├── log.js
│   └── publish.js
└── tsconfig.json
```
## 编译脚本说明
```bash
    # 以正式环境，运行electron
    "start": "tsc && cross-env NODE_ENV=production  electron out/main.js",
    # 以开发环境，运行electron
    "electron:dev": " tsc && cross-env DEBUG=* NODE_ENV=development electron out/main.js --trace-warnings",
    # 以开发环境，运行electron，并监听文件
    "electron:watch": "nodemon --config ./native/config/nodemon.json",
    # 以正式环境，编译electron-ts文件
    "electron:build": "cross-env NODE_ENV=production tsc ",
    # 运行前端页面
    "fronted:dev": "cd frontend && npm run dev",
    # 编译前端页面
    "fronted:build": "cd frontend && npm run build",
    # 拷贝前端页面dist到electron打包文件夹
    "fronted:copy": "node ./script/frontend-copy.js",
    # 检验代码
    "lint": "eslint native/**/ --ext .vue,.js,.ts,.jsx,.tsx --fix",
    # 编译整个electron应用的代码
    "build": "npm run fronted:build && npm run electron:build && npm run  fronted:copy ",
    # 打包electron应用的准备工作
    "publish-build-pre": "npm run build",
    # 打包electron，会有tag创建等操作，建议正式发布使用这个命令
    "ev-publish-build": "node ./script/publish.js",
    # 剩下的都是各类平台，版本的打包脚本
    "build-w": "electron-builder -w=nsis --x64 --config ./script/build/config/window.js ",
    "build-w-32": "electron-builder -w=nsis --ia32 --config ./script/build/config/window.js ",
    "build-w-64": "electron-builder -w=nsis --x64 --config ./script/build/config/window.js ",
    "build-w-arm64": "electron-builder -w=nsis --arm64 --config ./script/build/config/window.js ",
    "build-wz": "electron-builder -w=7z --x64 --config ./script/build/config/window.js ",
    "build-wz-32": "electron-builder -w=7z --ia32 --config ./script/build/config/window.js ",
    "build-wz-64": "electron-builder -w=7z --x64 --config ./script/build/config/window.js ",
    "build-wz-arm64": "electron-builder -w=7z --arm64 --config ./script/build/config/window.js ",
    "build-m": "electron-builder -m --x64 --arm64 --config ./script/build/config/mac.js ",
    "build-m-arm64": "electron-builder -m --arm64 --config ./script/build/config/mac.js ",
    "build-l": "electron-builder -l=deb --x64 --config ./script/build/config/mac.js ",
    "build-l-32": "electron-builder -l=deb --ia32 --config ./script/build/config/linux.js ",
    "build-l-64": "electron-builder -l=deb --x64 --config ./script/build/config/linux.js ",
    "build-l-arm64": "electron-builder -l=deb --arm64 --config ./script/build/config/linux.js ",
    "build-l-armv7l": "electron-builder -l=deb --armv7l --config ./script/build/config/linux.js ",
    "build-lr-64": "electron-builder -l=rpm --x64 --config ./script/build/config/linux.js ",
    "build-lp-64": "electron-builder -l=pacman --x64 --config ./script/build/config/linux.js ",
    # 执行该命令，会进行提交代码操作，但是会有一定的引导规则，会保证提交的日志规范
    "cz": "cz",
    # 安装依赖时，重新根据当前node，编译electronNode
    "postinstall": "electron-builder install-app-deps"

```

# commit 规范

## 建议使用script的cz命令来commit代码
``` bash
 # 执行该命令，会进行提交代码操作，但是会有一定的引导规则，会保证提交的日志规范
    "cz": "cz",
```
## 类型

| 类型     | 含义                                                                         |
| -------- | ---------------------------------------------------------------------------- |
| feature  | 特性                                                                         |
| refactor | 重构                                                                         |
| type     | 修复类型错误                                                                 |
| fix      | 修复,产生 diff 并自动修复此问题                                              |
| to       | 修复,只产生 diff 不自动修复此问题,适合于多次提交。最终修复问题提交时使用 fix |
| doc      | 文档                                                                         |
| test     | 单元测试                                                                     |
| example  | 例子                                                                         |
| chore    | 构建过程或辅助工具的变动                                                     |
| typo     | 修改错别字                                                                   |
| perf     | 优化相关，比如提升性能、体验。                                               |
| remove   | 移除代码                                                                     |
| release   | 移除代码                                                                     |

## TODO

- [x] 生命周期
- [x] 主窗口
- [ ] 日志插件
  - [x] 应用日志
  - [ ] 教学日志
  - [x] 网络日志
  - [ ] 本地缓存日志
- [ ] JsBridge
- [ ] 任务队列
- [ ] 实时检测
- [ ] 更新
- [ ] 本地方案