## lerna-template
>  lerna-template 项目模板

## 项目运行
> 项目使用yarn命名运行
### 前置
```bash
npm install yarn -g # 安装yarn，如果已安装请忽略
yarn config get registry # 查询包源配置
yarn config set registry https://registry.npm.taobao.org/ # 更改包源 
```
### 首次
```bash
yarn --ignore-scripts # 安装依赖
```
### 后续 （已有下载过以前的版本）
```bash
yarn run clean # 删除所有node_modules 或者自己文件夹删除
yarn  --ignore-scripts # 安装依赖
```

## git提交
- feat：新功能（feature）
- fix：修补bug
- docs：文档（documentation）
- style： 格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改bug的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动

### 提交代码
```bash
yarn run commit # 使用git-cz 命令选择，进行提交代码
```

### 版本发布

```bash
yarn run version # 升级各个包的版本，生成changelog,会直接提交代码到github请勿执行
```
## lerna管理
- `lerna bootstrap`	安装依赖
  - `– --production --no-optional`	指定npm client的参数
  - `–hoist`	把依赖安装到根目录的node_modules
  - `–ignore`	忽略的包 --ignore test-* 忽略名称以test开头的包
  - `–scope`	指定的包 参数的含义是指包的名称
  - `–ignore-scripts`	不执行声明周期脚本命令， 比如 prepare
  - `–registry`	指定registry
  - `–npm-client`	指定安装用的npm client lerna bootstrap --npm-client=yarn
  - `–use-workspace`	使用yarn workspace， 没用过
  - `–no-ci`	默认调用 npm ci 替换 npm install , 使用选项修改设置 npm ci 类似于 npm-install ，但它旨在用于自动化环境，如测试平台，持续集成和部署。
  - `–skip-git`	将不会创建git commit或tag
  - `–skip-npm`	将不会把包publish到npm上
  - `–canary`	可以用来独立发布每个commit，不打tag lerna publish --canary
- `lerna clean`	删除各个包下的node_modules
- `lerna init`	创建新的lerna库
- `lerna list`	显示package列表
  - `–json`	显示为json格式
  - `–all`	显示包含private的包
  - `–long`	显示更多的扩展信息
- `lerna changed`	显示自上次relase tag以来有修改的包， 选项通 list
- `lerna diff`	显示自上次relase tag以来有修改的包的差异， 执行 git diff
- `lerna exec`	在每个包目录下执行任意命令
- `lerna run`	执行每个包package.json中的脚本命令
- `lerna add`	添加一个包的版本为各个包的依赖
- `lerna import`	引入package
- `lerna link`	链接互相引用的库
- `lerna create`	新建package
- `lerna publish`	发布
