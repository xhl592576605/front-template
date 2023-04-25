const path = require('path')
const shell = require('shelljs')
const fsExtra = require('fs-extra')
const inquirer = require('inquirer')
const log = require('./log')
const buildElectron = require('./build')

const basePath = process.cwd()

const checkBranchMaster = () => {
  return new Promise((resolve, reject) => {
    shell.cd(basePath)
    let branch = shell.exec('git branch | grep "*"', { silent: true }).stdout
    branch = branch.replace('*', '').trim()
    // todo 临时处理成electron-senior 后续要改成electron-senior
    if (branch !== 'electron-senior') {
      reject('不是处于master分支')
      return
    }
    log.info(`${branch}: 拉取最新代码`)
    shell.exec(`git pull origin ${branch}`)

    // todo 临时处理成 注释文档
    // const statusLength =
    //   shell.exec('git status -s').stdout.split('\n').length - 1
    // if (statusLength > 0) {
    //   reject('请保证分支没有任何修改')
    //   return
    // }
    log.info(`拉取tags`)
    shell.exec('git fetch --tags', { silent: true })
    const lastTag = shell
      .exec('git describe --tags `git rev-list --tags --max-count=1`', {
        silent: true
      })
      .stdout.trim()
    log.info(`last lag: ${lastTag}`)
    resolve({ branch, lastTag })
  })
}

const updateTags = ({ branch, lastTag }) => {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt({
        type: 'input',
        name: 'tag',
        message: '请输入新的tag，小版本尾号加一，中版本，中号加一',
        default: lastTag,
        validate: (tag) => {
          if (tag === '') {
            return 'tag must required'
          }
          if (tag === lastTag) {
            return '请往上叠加tag，小版本尾号加一，中版本，中号加一'
          }
          return true
        }
      })
      .then((answer) => {
        const packagePath = basePath
        try {
          const packageJsonPath = path.join(packagePath, 'package.json')
          const newPackage = fsExtra.readJSONSync(packageJsonPath) || {}
          newPackage.version = answer.tag
          fsExtra.writeJsonSync(packageJsonPath, newPackage, {
            spaces: 2,
            EOL: '\n'
          })
          resolve({ branch, tag: answer.tag })
        } catch (e) {
          reject('更新包的版本号失败')
        }
      })
  })
}

const installDependencies = ({ branch, tag }) => {
  return new Promise((resolve, reject) => {
    shell.cd(basePath)
    log.info('installing  dependencies')
    shell.exec('pnpm install ', (code, stdout) => {
      if (code === 0) {
        resolve({ branch, tag })
      } else if (code === 1) {
        reject('安装依赖失败')
      }
    })
  })
}

const compileCode = ({ branch, tag }) => {
  return new Promise((resolve, reject) => {
    shell.cd(basePath)
    log.info('Compiling package')
    shell.exec('npm run publish-build-pre', (code, stdout) => {
      if (code === 0) {
        resolve({ branch, tag })
      } else if (code === 1) {
        reject('预编译失败')
      }
    })
  })
}

const addCodeAndPush = ({ branch, tag }) => {
  return new Promise((resolve, reject) => {
    shell.cd(basePath)
    shell.exec('git add .')
    shell.exec(`git commit --no-verify -m "add new version ${tag}"`) // 要去掉
    shell.exec(`git push origin ${branch}`)
    resolve({ branch, tag })
  })
}

const createTag = ({ branch, tag }) => {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt({
        type: 'input',
        name: 'context',
        message: '请输入版本发布的内容',
        validate: (context) => {
          if (context === '') {
            return 'context must required'
          }
          return true
        }
      })
      .then((answer) => {
        log.info(`add new tag ${tag}`)
        shell.cd(basePath)
        shell.exec(`git tag -a ${tag} -m "${answer.context}"`, (code) => {
          if (code !== 0) {
            reject('打 tag 失败')
            return
          }
          resolve({ branch, tag })
        })
      })
  })
}

const pushTag = (tag) => {
  return new Promise((resolve, reject) => {
    log.info(`push new tag ${tag}`)
    shell.cd(basePath)
    shell.exec(`git push origin ${tag}`, (code) => {
      if (code !== 0) {
        reject(`tag ${tag}: 推送到远端失败`)
        return
      }
      resolve()
    })
  })
}

const deleteTag = (tag) => {
  log.info(`delete  tag ${tag}`)
  return new Promise((resolve, reject) => {
    shell.cd(basePath)
    shell.exec(`git tag -d ${tag}`, (code) => {
      if (code !== 0) {
        reject(`tag ${tag}:删除本地分支失败`)
        return
      }
      backToMaster()
      resolve()
    })
  })
}

const buildSoft = ({ tag }) => {
  return new Promise((resolve, reject) => {
    shell.cd(basePath)
    const checkOutCode = shell.exec(`git checkout ${tag}`).code
    if (checkOutCode !== 0) {
      reject(`切换tag ${tag} 失败`)
      return
    }
    try {
      log.info('build electron ')
      buildElectron(tag)
        .then(() => resolve(tag))
        .catch((err) => {
          deleteTag(tag).then(() => {
            reject('build electron failed: ' + err.message)
          })
        })
    } catch (e) {
      reject('更新包的版本号失败')
    }
  })
}

const backToMaster = () => {
  return new Promise((resolve, reject) => {
    shell.cd(basePath)
    shell.exec('git checkout electron-senior')
    setTimeout(resolve, 1000)
  })
}

const main = () => {
  /**
   * 1. 获取 是不是在master分支
   * 2. 获取 目前的tags
   * 3. 修改tags
   * 4. 编译通过
   * 5. 新增提交
   * 6. push tag
   * 7. 打包electron
   * 8. 上传tag
   */
  log.info('开始执行脚本')
  checkBranchMaster()
    .then(updateTags)
    .then(installDependencies)
    .then(compileCode)
    .then(addCodeAndPush)
    .then(createTag)
    .then(buildSoft)
    .then(pushTag)
    .then(backToMaster)
    .catch((err) => {
      log.error(`错误:${err}`)
    })
    .finally(() => {
      log.info('结束执行脚本')
    })
}

main()
