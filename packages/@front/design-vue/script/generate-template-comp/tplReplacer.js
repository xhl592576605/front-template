const fs = require('fs-extra')
const handlebars = require('handlebars')
const { resolve } = require('path')

const getTplFilePath = (meta) => ({
  // docs 目录
  readme: {
    from: './.template/docs/README.md.tpl',
    to: `../../components/${meta.compClassName}/docs/README.md`
  },
  demo: {
    from: './.template/docs/demo.vue.tpl',
    to: `../../components/${meta.compClassName}/docs/demo.vue`
  },
  // src 目录
  vue: {
    from: './.template/index.vue.tpl',
    to: `../../components/${meta.compClassName}/${meta.compName}.vue`
  },
  // 根目录
  install: {
    from: './.template/index.ts.tpl',
    to: `../../components/${meta.compClassName}/index.ts`
  },
})

const compFilesTplReplacer = (meta) => {
  const filePaths = getTplFilePath(meta)
  Object.keys(filePaths).forEach((key) => {
    const fileTpl = fs.readFileSync(resolve(__dirname, filePaths[key].from), 'utf-8')
    const fileContent = handlebars.compile(fileTpl)(meta)
    fs.outputFile(resolve(__dirname, filePaths[key].to), fileContent, (err) => {
      if (err) console.log(err)
    })
  })
}

// 读取 components/list.json 并更新
const listJsonTplReplacer = (meta) => {
  const listFilePath = '../../components/list.json'
  const listFileTpl = fs.readFileSync(resolve(__dirname, listFilePath), 'utf-8')
  const listFileContent = JSON.parse(listFileTpl)
  listFileContent.push(meta)
  const newListFileContentFile = JSON.stringify(listFileContent, null, 2)
  fs.writeFile(resolve(__dirname, listFilePath), newListFileContentFile, (err) => {
    if (err) console.log(err)
  })
  return listFileContent
}

// 更新 router.ts
const routerTplReplacer = (listFileContent) => {
  const routerFileFrom = './.template/router.ts.tpl'
  const routerFileTo = '../../src/router/index.ts'
  const routerFileTpl = fs.readFileSync(resolve(__dirname, routerFileFrom), 'utf-8')
  const routerMeta = {
    routes: listFileContent.map((comp) => `{
  title: '${comp.compZhName}',
  name: '${comp.compName}',
  path: '/components/${comp.compName}',
  component: () => import('../../components/${comp.compClassName}/docs/README.md'),
}`)
  }
  const routerFileContent = handlebars.compile(routerFileTpl, { noEscape: true })(routerMeta)
  fs.outputFile(resolve(__dirname, routerFileTo), routerFileContent, (err) => {
    if (err) console.log(err)
  })
}
// 导出组件
const componentsTsTplReplacer = (meta) => {
  const componentsTsFilePath = '../../components/components.ts'
  let componentsTsContent = fs.readFileSync(resolve(__dirname, componentsTsFilePath), 'utf-8')
  componentsTsContent += `
export { default as ${meta.compName} } from './${meta.compClassName}'
`
  fs.outputFile(resolve(__dirname, componentsTsFilePath), componentsTsContent, (err) => {
    if (err) console.log(err)
  })
}

module.exports = (meta) => {
  compFilesTplReplacer(meta)
  const listFileContent = listJsonTplReplacer(meta)
  routerTplReplacer(listFileContent)
  componentsTsTplReplacer(meta)
  console.log(`组件新建完毕，请前往 components/${meta.compName} 目录进行开发`);
}
