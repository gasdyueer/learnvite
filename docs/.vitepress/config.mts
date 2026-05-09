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
      { text: '自控力', link: '/how-to-improve-self-control' },
      { text: 'AviUtl2 指南', link: '/aviutl2-guide' },
      { text: '工程控制论', link: '/engineering-cybernetics' },
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
          { text: '【转载文章】 视频钩子', link: '/short_video_hooks' }
        ]
      },
      {
        text: 'AviUtl2 指南',
        items: [
          { text: 'AviUtl2 扩展编辑器完整指南', link: '/aviutl2-guide' },
          { text: 'AviUtl ExEdit2的Lua脚本指南 - 完整版', link: '/script-guide' },
        ]
      },

      {
        text: '科普文章',
        items: [
          { text: '工程控制论：一门关于"关系"的科学', link: '/engineering-cybernetics' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/gasdyueer' }
    ]
  }
})
