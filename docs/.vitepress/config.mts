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
          { text: 'Aviutl ExEdit2的Lua脚本指南', link: '/lua-script-guide' },
          { text: 'Aviutl ExEdit2的Lua脚本指南 v2.0', link: '/lua-script-guide2' },
          { text: 'Aviutl ExEdit2的Lua脚本指南 v3.0 - 完整版', link: '/lua-script3' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/gasdyueer' }
    ]
  }
})
