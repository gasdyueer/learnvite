# learnvite

基于 [VitePress](https://vitepress.dev) 构建的个人知识站点，收录技术与科普文章，通过 GitHub Pages 自动部署。

## 内容


<!-- AUTO_CONTENT_START -->
- **[如何提高自控力](/docs/how-to-improve-self-control.md)**
  独辟蹊径地将自制力视为可量化的工程问题。通过"价值函数"与"权重贴现"模型剖析拖延与冲动，提出第一代自控技术"链式时延协议"（CTDP）和第二代"递归稳态迭代协议"（RSIP），以系统性、累积性的迭代实现生活稳态的根本性跃迁。
- **[Lua 脚本指南 v4.0 - 完整参考手册](/docs/script-guide.md)**
  AviUtl ExEdit2 Lua 脚本编写完整参考手册 v4.0。基于官方 v2.00 beta45 文档重构，覆盖设定项目定义、像素操作、音频处理、着色器操作等全部功能，含粒子系统、音频可视化、3D旋转、波浪文字等实用示例，以及性能优化和故障排除指南。
- **[AviUtl2 扩展编辑器完整指南](/docs/aviutl2-guide.md)**
  AviUtl2 ExEdit2 v2.00 beta45 扩展编辑器完整使用指南。涵盖模块化用户界面、对象类型（视频/图像/文本/图形/脚本）、控制字符语法、参照式、快捷键配置、插件管理和故障排除，适合从初学者到高级用户的完整学习路径。
- **[工程控制论：一门关于"关系"的科学](/docs/engineering-cybernetics.md)**
  基于钱学森《工程控制论》（新世纪版）全书内容梳理的科普文章。从"它不研究什么"切入，讲解反馈原理、系统稳定性、非线性、自寻最优控制、工程近似智慧，以及控制论从机器到生物到社会的统一性——揭示一切复杂系统共同的组织逻辑。
- **[视频钩子](/docs/short_video_hooks.md)**
  深入探讨如何通过优化视频"钩子"（Hook）来大幅提升播放量。分析钩子效果不佳的四种常见错误，提供立即提升视频观看量的实用方法——帮助观众决定"主动选择"并持续观看。
- **[promo](/docs/promo.md)**
- **[网络教程视频文案编写指南](/docs/video-script-guide.md)**
  基于MIT Patrick Winston教授《如何说话》演讲，提炼专为网络教程视频设计的文案编写指南。涵盖赋能承诺开场、三段式结构、认知边界构建、极简画面原则、强有力结尾等核心技巧。
- **[CS:GO VNL 加速深度教学：告别盲目摇鼠，掌握节奏的艺术](/docs/vnl-acceleration-guide.md)**
  深入解析 CS:GO VNL（Velocity Normal）加速机制，避开减速区陷阱，掌握三种加速节奏、大跳松蹲时机与 Low Jump 技巧。
<!-- AUTO_CONTENT_END -->

## 本地开发

```bash
npm install
npm run docs:dev      # 启动开发服务器
npm run docs:build    # 构建生产版本
npm run docs:preview  # 预览构建产物
```

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建并部署到 GitHub Pages。

## 技术栈

- [VitePress](https://vitepress.dev) — 静态站点生成器
- [markdown-it-mathjax3](https://www.npmjs.com/package/markdown-it-mathjax3) + [KaTeX](https://katex.org) — 数学公式渲染

## License

MIT
