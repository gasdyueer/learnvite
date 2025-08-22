import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  base: '/learnvite/',
  markdown: {
    math: true
  },
  title: "learnvite",
  description: "A vitepress site to put good articles",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '示例', link: '/markdown-examples' },
      { text: '转载文章', link: '/how-to-improve-self-control' },
    ],

    sidebar: [
      {
        text: '示例',
        items: [
          { text: 'Markdown 示例', link: '/markdown-examples' },
          { text: 'API 示例', link: '/api-examples' },
        ]
      },
      {
        text: '转载文章',
        items: [
          { text: '【转载文章】 如何提高自控力', link: '/how-to-improve-self-control' },
          { text: 'Aviutl ExEdit2的Lua脚本指南', link: '/lua-script-guide' },
          { text: 'Aviutl ExEdit2的Lua脚本指南-beta7版本', link: '/lua-script-guide2' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/gasdyueer' }
    ]
  }
})
