# AGENT_PROBLEM: 向 VitePress 博客发布文章的流程、问题与解决办法

## 背景

将外部 Markdown 文章 `工程控制论_科普文章.md` 发布到基于 VitePress 的博客站点 `learnvite`。

涉及文件：
- `docs/engineering-cybernetics.md` — 新增文章
- `docs/.vitepress/config.mts` — 导航栏和侧边栏配置
- `docs/index.md` — 首页（hero actions + features）

---

## 发布流程

1. 将源文件复制到 `docs/` 目录下，使用英文 slug 命名（`engineering-cybernetics.md`）
2. 更新 `config.mts`：
   - 在 `nav` 数组中添加导航链接
   - 在 `sidebar` 数组中添加侧边栏分组及条目
3. 更新 `index.md`：
   - 在 `hero.actions` 中添加入口按钮
   - 在 `features` 列表中添加功能卡片
4. 运行 `npm run docs:build` 验证构建通过

---

## 遇到的问题与解决办法

### 问题 1：Windows 下 bash copy 命令不可用

**现象**：
```bash
copy "E:\somepys\..." "E:\frontendplay\..."
# error: command not found: copy
```

**原因**：`copy` 是 Windows CMD 内部命令，不在 bash 环境的 PATH 中。

**解决**：放弃 bash 复制，改用 `read` 读取源文件全部内容（`:raw` 模式获取 verbatim 文本），再通过 `write` 工具写入目标路径。一次 `read` + 一次 `write` 完成，且写入前可以验证内容完整性。

**教训**：在 Windows 环境下，文件复制不应使用 bash，优先使用 `read` + `write` 工具链。

---

### 问题 2：Edit 工具反复因文件偏移而拒绝

**现象**：并行发出的多个 `edit` 调用中，后执行的调用因前面调用修改了文件导致行号/哈希偏移而被拒绝：
```
Edit rejected: N lines have changed since the last read (marked *).
```

**原因**：`edit` 依赖最后一次 `read` 的锚点（行号 + 内容哈希）。当对同一文件并行发送多个 `edit` 时，先完成的 edit 改变了文件内容，后续 edit 的锚点瞬间失效。

**解决办法**：
- 对于同一文件的多个编辑，尽量在单次 `edit` 调用中组合多个操作（`+`、`-`、`=` 可在一次 patch 中混合使用）
- 如果必须分次编辑，每次被拒绝后立即 `read:raw` 重新获取锚点再重试
- 对不同文件的编辑可以安全并行，不受此限制

**教训**：同文件编辑应串行化或合并在一次 `edit` 调用中。并行仅适用于不同文件。

---

### 问题 3：导航条目放到了 nav 数组外部

**现象**：`config.mts` 中 `{ text: '工程控制论', link: '/engineering-cybernetics' }` 出现在 `nav` 数组的 `]` 之后、`sidebar` 之前，导致 TypeScript 语法错误。

**原因**：`edit` 在添加 nav 条目时，锚点 `17th` 被自动 rebase 到了 `20th`（实际指向的是 `]` 之后的空行），新条目被插入到了错误位置。

```
// 错误结果
nav: [
  { text: 'AviUtl2 指南', link: '/aviutl2-guide' },
],                                    // ← nav 数组在此闭合

  { text: '工程控制论', ... },         // ← 悬挂在数组外
sidebar: [
```

**解决**：删除悬挂行，在 `]` 之前（即 `{ text: 'AviUtl2 指南' ... }` 之后、`]` 之前）重新插入。

**教训**：在闭合括号 `]` / `}` 之前插入数组元素时，需要精确指定插入位置为闭合括号的前一行。自动 rebase 后的锚点需要人工验证是否指向预期位置。

---

### 问题 4：Feature 卡片放到了 YAML frontmatter 外部

**现象**：`index.md` 中新的 feature 卡片出现在 `---`（YAML 结束分隔符）之后：

```
---
  - title: 【科普文章】...    ← 在 frontmatter 之外，不被解析
```

**原因**：VitePress 首页使用 YAML frontmatter 来定义 `hero` 和 `features`。`---` 是 frontmatter 的结束标记。feature 卡片必须放在两个 `---` 之间。`edit` 的锚点 rebase 导致插入位置偏移到了 `---` 之后。

**解决**：删除外部内容，在最后一个 feature 条目之后、`---` 之前重新插入。

**教训**：编辑 YAML frontmatter 时需要特别注意 `---` 边界。插入内容前后验证是否在正确的 YAML 区域内。

---

### 问题 5：侧边栏分组放到了 sidebar 数组外部

**现象**：`config.mts` 中 "科普文章" 侧边栏分组出现在 `sidebar` 数组的 `]` 之后、`socialLinks` 之前：

```
sidebar: [
  ...
  { text: 'AviUtl2 指南', items: [...] }
],                                    // ← sidebar 数组在此闭合

  {                                    // ← 悬挂在数组外
    text: '科普文章',
    items: [...]
  },
socialLinks: [
```

**原因**：与问题 3 相同 —— 插入操作用了 `+ 46ho`，该锚点指向 `sidebar` 的闭合 `]`，导致新内容被追加到数组外部。

**解决**：三步修复：
1. 删除外部悬挂的侧边栏分组
2. 在最后一个合法分组 `}` 之后、`]` 之前插入
3. 补充缺失的逗号（见问题 6）

**教训**：插入数组元素应使用 `<`（在闭合括号之前插入）而非 `+`（在锚点行之后插入）。

---

### 问题 6：数组元素间缺少逗号

**现象**：将 "科普文章" 分组移入 `sidebar` 数组后，前一个分组的 `}` 与新增分组之间缺少逗号：

```typescript
sidebar: [
  ...
  { text: 'AviUtl2 指南', items: [...] }   // ← 缺少逗号
  { text: '科普文章', items: [...] },       // TypeScript 语法错误
]
```

**原因**：删除旧位置内容时连带删除了前一个元素末尾的 `},`，替换为 `}` 时丢失了逗号。

**解决**：将 `}` 替换为 `},`。

**教训**：移动数组元素时，务必检查目标位置前后的逗号是否完整。可以一次 `edit` 调用中同时执行删除和插入操作，避免逗号丢失。

---

### 问题 7：多余空行残留

**现象**：`config.mts` 中 `sidebar` 数组的 `]` 与 `socialLinks` 之间出现双空行。

**原因**：多次编辑操作（删除、插入、再删除）导致空行累积。

**解决**：删除多余空行。

**教训**：编辑完成后应通读最终文件，清理格式残留。

---
### 问题 8：GitHub Pages 部署认证失败

**现象**：GitHub Actions 中 `deploy.yml` workflow 构建成功，但 `git push` 到 `gh-pages` 分支时报错：
```
remote: Invalid username or token.
Password authentication is not supported for Git operations.
fatal: Authentication failed for 'https://github.com/gasdyueer/learnvite.git/'
Error: Process completed with exit code 128.
```

**原因**：旧 workflow 使用自定义 `secrets.GH_TOKEN` 通过 HTTPS URL 嵌入 token 的方式做 `git push` 认证：
```yaml
git remote add origin https://x-access-token:${{ secrets.GH_TOKEN }}@github.com/${{ github.repository }}.git
git push origin HEAD:gh-pages -f
```
GitHub 拒绝了该认证，可能原因：(1) `GH_TOKEN` secret 未在仓库中配置；(2) token 无效或过期；(3) token 缺少 `repo` scope / `Contents: write` 权限。

**解决**：放弃手动 git push，换用 VitePress 官方推荐的 `actions/deploy-pages` 方案：
- 用 `actions/upload-pages-artifact@v3` 上传构建产物
- 用 `actions/deploy-pages@v4` 部署到 Pages
- 全部使用内置 `GITHUB_TOKEN`，无需配置任何自定义 secret
- 在仓库 Settings → Pages → Source 中选择 GitHub Actions

**教训**：GitHub Pages 部署应优先使用官方 action（`actions/deploy-pages`），避免手写 git push 认证逻辑。自定义 token 方案在 secret 缺失或权限不足时会静默失败，排查成本高。

---

**附加**：`deploy.yml` 中还需声明 `permissions: contents: read, pages: write, id-token: write`，否则 `GITHUB_TOKEN` 默认权限不足以完成 Pages 部署。

## 改进建议

1. **文件复制**：Windows 下避免使用 bash 复制命令，统一使用 `read` + `write`
2. **同文件编辑**：同一文件的多个修改合并在单次 `edit` 调用中完成；不同文件可并行
3. **数组插入**：向 `[...]` 中追加元素，使用 `<` 在 `]` 之前插入，而非 `+` 在 `]` 之后插入
4. **YAML frontmatter**：编辑 `---` 包裹的 YAML 区域时，确认插入位置在分隔符内部
5. **自动 rebase**：不信任 `edit` 的自动锚点 rebase，尤其在 rebase 跨越数组/对象边界后
6. **构建验证**：每次配置修改后运行 `npm run docs:build` 确保无语法/结构错误
