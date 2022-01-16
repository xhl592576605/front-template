// rubbish code here

import { h } from 'vue'
import { RouterLink } from 'vue-router'

export const renderMenuLabel = (option) => {
  if (!('path' in option) || option.label === '--Debug') {
    return option.label
  }
  return h(
    RouterLink,
    {
      to: option.path
    },
    { default: () => option.label }
  )
}

const appendCounts = (item) => {
  if (!item.children) {
    item.count = 1
    return item
  }
  if (item.children) {
    item.children.forEach(appendCounts)
    item.count = item.children.reduce((sum, item) => sum + item.count, 0)
    if (item.type === 'group') {
      item.en += ` (${item.count})`
      item.zh += ` (${item.count})`
    }
    return item
  }
}

// const createDebugDemos = (item, mode) => {
//   if (__DEV__ && mode === 'debug') {
//     return [item]
//   } else return []
// }

function createItems (lang, theme, prefix, items) {
  const isZh = lang === 'zh-CN'
  const langKey = isZh ? 'zh' : 'en'
  return items.map((rawItem) => {
    const item = {
      ...rawItem,
      key: rawItem.en,
      label: rawItem[langKey] || rawItem.en,
      extra: rawItem.enSuffix && isZh ? rawItem.en : undefined,
      path: rawItem.path
        ? `/${lang}/${theme}` + prefix + rawItem.path
        : undefined
    }
    if (rawItem.children) {
      item.children = createItems(lang, theme, prefix, rawItem.children)
    }
    return item
  })
}

export function createDocumentationMenuOptions ({ lang, theme, mode }) {
  return createItems(lang, theme, '/docs', [
    {
      en: 'Introduction',
      zh: '介绍',
      type: 'group',
      children: [
        {
          en: 'Design Vue',
          zh: 'Design Vue',
          path: '/introduction'
        }
      ]
    },
    {
      en: 'Getting Started',
      zh: '快速上手',
      type: 'group',
      children: [
        {
          en: 'Installation',
          zh: '安装',
          path: '/installation'
        }
      ]
    }
  ])
}

export function createComponentMenuOptions ({ lang, theme, mode }) {
  return createItems(lang, theme, '/components', [
    appendCounts({
      zh: '通用组件',
      en: 'Common Components',
      type: 'group',
      children: [
        {
          en: 'Button',
          zh: '按钮',
          enSuffix: true,
          path: '/button'
        },
      ]
    }),
  ])
}
