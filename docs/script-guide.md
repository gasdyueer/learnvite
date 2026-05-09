---
title: Lua 脚本指南 v3.0 - 完整参考手册
description: AviUtl 扩展编辑器 Lua 脚本的完整参考指南，包含所有函数、变量和使用示例
outline: deep
---

# Lua 脚本指南 v3.0

::: info 版本信息
- **文档版本**: 3.0
- **最后更新**: 2025年9月21日
- **适用版本**: AviUtl 扩展编辑器 2.00 及以上
- **语言支持**: Lua / LuaJIT
- **技术支持**: 基于官方文档整理，包含最新功能
:::

## 📋 目录

- [关于 Lua 脚本](#关于-lua-脚本)
- [重要注意事项](#重要注意事项)
- [脚本文件位置](#脚本文件位置)
- [设置项目定义](#设置项目定义)
  - [轨道条项目](#轨道条项目)
  - [复选框项目](#复选框项目)
  - [颜色设置项目](#颜色设置项目)
  - [文件选择项目](#文件选择项目)
  - [字体设置项目](#字体设置项目)
  - [图形设置项目](#图形设置项目)
  - [列表选择项目](#列表选择项目)
  - [变量项目](#变量项目)
  - [其他设置](#其他设置)
- [内置变量](#内置变量)
- [扩展函数](#扩展函数)
  - [文本处理](#文本处理)
  - [特效处理](#特效处理)
  - [绘制函数](#绘制函数)
  - [图像加载](#图像加载)
  - [字体设置](#字体设置)
  - [随机数生成](#随机数生成)
  - [选项设置](#选项设置)
  - [信息获取](#信息获取)
  - [像素操作](#像素操作)
  - [音频处理](#音频处理)
  - [缓冲区操作](#缓冲区操作)
  - [着色器操作](#着色器操作)
  - [轨道条操作](#轨道条操作)
  - [锚点操作](#锚点操作)
  - [数学工具](#数学工具)
  - [调试工具](#调试工具)
- [使用示例](#使用示例)
- [高级技巧](#高级技巧)
- [故障排除](#故障排除)
- [更新历史](#更新历史)

## 关于 Lua 脚本

在 AviUtl 扩展编辑器中，脚本控制、脚本文件（`*.anm2`, `*.obj2`, `*.cam2`, `*.scn2`, `*.tra2`）以及文本的脚本控制字符中，可以使用 **Lua 语言**。

### 主要特性

- 🎯 **扩展功能**: 提供了丰富的变量和函数扩展
- 🔄 **兼容性**: 支持旧脚本文件格式（`*.anm`, `*.obj`, `*.cam`, `*.scn`, `*.tra`）
- ⚠️ **部分限制**: 旧脚本文件中的某些功能可能不被支持
- 🚀 **高性能**: 支持 LuaJIT，性能大幅提升
- 🆕 **最新功能**: 支持像素操作、着色器、音频处理等高级功能

### 脚本类型

- **luaJIT** (默认): 高性能 JIT 编译版本
- **lua**: 标准 Lua 解释器版本

```lua
-- 指定脚本类型为标准 Lua
--script:lua
```

## 重要注意事项

::: warning 重要提醒
- 脚本字符编码必须为 **UTF-8**（旧脚本文件为 SJIS）
- 脚本存放位置: `ProgramData\aviutl2\Script\` 文件夹
- 脚本调用脚本可能无法正常工作
- 执行"丢弃缓存"操作会重新加载脚本（包括着色器），但设置项更改不会反映
- 旧脚本文件格式的 `pixel` 输出系列函数不支持（建议改用着色器）
- **新增**: 像素操作函数相对耗费性能，建议谨慎使用
- 脚本控制仅支持 `table`、`string`、`math` 库；`os`、`debug`、`ffi.C` 等库已被移除
:::

## 脚本文件位置

脚本文件必须放置在以下目录中：

```
📁 ProgramData
└── 📁 aviutl2
    └── 📁 Script
        ├── 📄 脚本文件1.anm2
        ├── 📄 脚本文件2.obj2
        └── 📁 子文件夹
            └── 📄 其他脚本.lua
```

::: tip 文件位置重要提醒
- 脚本文件必须放在 `ProgramData\aviutl2\Script\` 目录下
- 支持子文件夹分类管理，便于组织脚本文件
- 脚本文件编码必须为 UTF-8
:::

::: info 目录说明
- **Script**: Lua 脚本文件主目录
- **子文件夹**: 支持任意层级的子目录结构
- **文件类型**: 支持 `.lua`、`.anm2`、`.obj2` 等格式
:::

## 设置项目定义

在脚本文件开头使用特殊注释可以添加各种设置项目，这些项目将显示在编辑器的设置面板中。

### 轨道条项目

创建可拖动的数值调节滑块。

```lua
--track@变量名:项目名,最小值,最大值,默认值,移动单位
```

**参数说明：**
- `变量名`: 脚本中使用的变量名
- `项目名`: 在界面上显示的项目名称
- `最小值`: 滑块的最小值
- `最大值`: 滑块的最大值
- `默认值`: 初始值
- `移动单位`: 可选，数值变化步长（1, 0.1, 0.01, 0.001 或省略）

**示例：**
```lua
--track@vx:X轴速度,-10,10,0
--track@scale:缩放比例,0.1,5.0,1.0,0.1

obj.ox = obj.ox + vx * obj.time
obj.zoom = scale
```

::: tip 兼容性
旧脚本文件格式: `--track0:项目名,最小值,最大值,默认值,移动单位`
:::

::: info 轨道条使用技巧
- **变量名规范**: 使用简洁的英文或拼音命名
- **数值范围**: 根据实际需求设置合理的范围
- **步长设置**: 小数点数值适合精细调节
- **实时预览**: 拖动时可实时看到效果变化
:::

### 复选框项目

创建布尔值开关。

```lua
--check@变量名:项目名,默认值(0或1)
```

**示例：**
```lua
--check@enable_gravity:启用重力,0
--check@reverse:反转效果,1

if enable_gravity then
    -- 重力效果代码
    obj.oy = obj.oy + 9.8 * obj.time * obj.time / 2
end
```

::: tip 兼容性
旧脚本文件格式: `--check0:项目名,默认值(0或1)`
:::

### 颜色设置项目

创建颜色选择器。

```lua
--color@变量名:项目名,默认值
```

**参数说明：**
- `默认值`: 十六进制颜色值（0x000000～0xffffff）
- 特殊值: `nil` 允许选择透明色

**示例：**
```lua
--color@main_color:主颜色,0xff0000
--color@bg_color:背景颜色,nil

obj.load("figure", "圆", main_color, 100)
```

::: tip 兼容性
旧脚本文件格式: `--color:默认值`
:::

### 文件选择项目

创建文件路径选择器。

```lua
--file@变量名:项目名
```

**示例：**
```lua
--file@image_path:图像文件
--file@video_path:视频文件

if image_path ~= "" then
    obj.load("image", image_path)
end
```

::: tip 兼容性
旧脚本文件格式: `--file:`
:::

### 字体设置项目

创建字体选择器。

```lua
--font@变量名:项目名,默认值
```

**示例：**
```lua
--font@main_font:主字体,微软雅黑
--font@title_font:标题字体,Arial

obj.setfont(main_font, 24, 0, 0x000000, 0xffffff)
```

### 图形设置项目

创建图形类型选择器。

```lua
--figure@变量名:项目名,默认值
```

**示例：**
```lua
--figure@shape:图形形状,圆形
--figure@tip_shape:尖端图形,三角形

obj.load("figure", shape, 0xffffff, 100)
```

### 列表选择项目

创建下拉列表选择器。

```lua
--select@变量名:项目名=默认值,选项=值,选项=值,选项=值
```

**参数说明：**
- `默认值`: 可选，不指定则使用第一个选项
- `选项=值`: 显示的选项名称和对应的数值

**示例：**
```lua
--select@animation_type:动画类型,线性动画=0,缓动动画=1,弹性动画=2,反弹动画=3
--select@deco:装饰类型=0,标准文字=0,带影文字=1,带影文字(薄)=2,描边文字=3,描边文字(细)=4,描边文字(粗)=5,描边文字(角)=6

if animation_type == 0 then
    -- 线性动画
    obj.ox = obj.ox + obj.time * 10
elseif animation_type == 1 then
    -- 缓动动画
    local t = obj.time / 2
    obj.ox = obj.ox + (1 - math.cos(t * math.pi)) / 2 * 200
end
```

### 文本设置项目

创建多行文本输入框。

```lua
--text@变量名:项目名,默认值
```

**示例：**
```lua
--text@content:文本内容,"默认文字\n下一行"

obj.load("text", content)
```

### 变量项目

创建文本输入框，支持多种数据类型。

```lua
--value@变量名:项目名,默认值
```

**数据类型说明：**
- **数值**: 默认值为数字
- **字符串**: 默认值为带引号的字符串
- **数组**: 默认值为花括号包围的数组

**示例：**
```lua
--value@speed:移动速度,5.0
--value@message:显示文本,"Hello World"
--value@positions:位置数组,{0,0,0}

obj.ox = obj.ox + speed * obj.time
obj.load("text", message)
```

### 其他设置

#### 对象菜单标签

```lua
--label:标签名
```

**示例：**
```lua
--label:特效滤镜
```

#### 脚本信息

```lua
--information:脚本描述信息
```

**示例：**
```lua
--information:粒子系统效果 v3.0 by User
```

#### 脚本类型指定

```lua
--script:脚本类型
```

**示例：**
```lua
--script:luaJIT  -- 默认值
--script:lua     -- 标准Lua
```

#### 像素着色器

在脚本文件开头使用多行注释定义 HLSL 像素着色器：

```hlsl
--[[pixelshader@着色器名称:
    float4 着色器名称(float4 pos : SV_Position) : SV_Target {
        // HLSL 代码
        return float4(1.0, 1.0, 1.0, 1.0);
    }
]]
```

#### 计算着色器

```hlsl
--[[computeshader@着色器名称:
    [numthreads(1, 1, 1)]
    void 着色器名称(uint2 id : SV_DispatchThreadID) {
        // HLSL 计算代码
    }
]]
```

::: warning 注意
着色器名称将作为入口点函数名使用。
:::

## 内置变量

目标对象的信息存储在以下内置变量中：

| 变量名 | 类型 | 说明 |
|--------|------|------|
| `obj.x` | 只读 | 显示基准坐标 X |
| `obj.y` | 只读 | 显示基准坐标 Y |
| `obj.z` | 只读 | 显示基准坐标 Z |
| `obj.w` | 只读 | 图像宽度 |
| `obj.h` | 只读 | 图像高度 |
| `obj.ox` | 读写 | 相对于基准坐标的 X 偏移 |
| `obj.oy` | 读写 | 相对于基准坐标的 Y 偏移 |
| `obj.oz` | 读写 | 相对于基准坐标的 Z 偏移 |
| `obj.rx` | 读写 | X 轴旋转角度 (360.0 = 一圈) |
| `obj.ry` | 读写 | Y 轴旋转角度 (360.0 = 一圈) |
| `obj.rz` | 读写 | Z 轴旋转角度 (360.0 = 一圈) |
| `obj.cx` | 读写 | 中心的相对 X 坐标 |
| `obj.cy` | 读写 | 中心的相对 Y 坐标 |
| `obj.cz` | 读写 | 中心的相对 Z 坐标 |
| `obj.zoom` | 读写 | 缩放率 (1.0 = 原始大小) |
| `obj.alpha` | 读写 | 不透明度 (0.0～1.0) |
| `obj.aspect` | 读写 | 宽高比 (-1.0～1.0) |
| `obj.framerate` | 只读 | 帧率 |
| `obj.frame` | 只读 | 当前帧号 |
| `obj.time` | 只读 | 当前时间(秒) |
| `obj.totalframe` | 只读 | 总帧数 |
| `obj.totaltime` | 只读 | 总时间(秒) |
| `obj.layer` | 只读 | 绘制目标对象的图层位置 |
| `obj.index` | 只读 | 多对象时的编号 |
| `obj.num` | 只读 | 多对象时的数量 |
| `obj.screen_w` | 只读 | 屏幕宽度 |
| `obj.screen_h` | 只读 | 屏幕高度 |

## 扩展函数

### 文本处理

#### obj.mes(text)

在文本对象中插入指定文本。

```lua
obj.mes("要插入的文本内容")
```

**参数：**
- `text` (string): 要显示的文本

**使用限制：** 只能在文本对象的文本内使用

**兼容性：** 可省略 `obj.` 直接使用 `mes()`

### 特效处理

#### obj.effect([name,param1,value1,param2,value2,...])

执行指定的滤镜效果。

```lua
-- 执行默认滤镜效果
obj.effect()

-- 执行指定滤镜效果
obj.effect("色调校正", "亮度", 150, "色相", 180)
```

**参数：**
- `name` (string, 可选): 特效名称
- `param1,value1` (可变参数): 特效参数名和值

**使用限制：** 仅媒体对象可用

**特殊说明：**
- 不带参数调用时，执行脚本之后的所有滤镜效果
- 轨道条、复选框以外的设置参数使用别名文件中的名称和值
- 旧脚本文件参数会自动转换

### 绘制函数

#### obj.draw([ox,oy,oz,zoom,alpha,rx,ry,rz])

绘制当前对象。

```lua
-- 简单绘制
obj.draw()

-- 带参数绘制
obj.draw(10, 20, 0, 1.5, 0.8, 0, 0, 45)
```

**参数（全部可选）：**
- `ox`: 相对 X 坐标
- `oy`: 相对 Y 坐标
- `oz`: 相对 Z 坐标
- `zoom`: 缩放率 (1.0 = 原始大小)
- `alpha`: 不透明度 (0.0-1.0)
- `rx`: X 轴旋转角度
- `ry`: Y 轴旋转角度
- `rz`: Z 轴旋转角度

**注意：** 使用此函数时，脚本之后的滤镜效果将不会执行

#### obj.drawpoly(x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3[,u0,v0,u1,v1,u2,v2,u3,v3,alpha])

以任意四边形绘制对象任意部分。

```lua
-- 简单四边形绘制
obj.drawpoly(-50,-50,0, 50,-50,0, 50,50,0, -50,50,0)

-- 带纹理坐标的绘制
obj.drawpoly(-50,-50,0, 50,-50,0, 50,50,0, -50,50,0,
             0,0, obj.w,0, obj.w,obj.h, 0,obj.h)
```

**参数：**
- `x0,y0,z0` ~ `x3,y3,z3`: 四个顶点的坐标
- `u0,v0` ~ `u3,v3` (可选): 对应的纹理坐标
- `alpha` (可选): 不透明度

**限制：** 内角必须全部小于180度

#### obj.drawpoly({table}[,vertex_num,alpha])

使用表格形式批量绘制多个四边形或顶点列表。

```lua
-- 批量绘制四边形
local vertices = {}

-- 添加第一个四边形
table.insert(vertices, {x0,y0,0,x1,y1,0,x2,y2,0,x3,y3,0,u0,v0,u1,v1,u2,v2,u3,v3})

-- 添加第二个四边形
table.insert(vertices, {x0,y0,100,x1,y1,100,x2,y2,100,x3,y3,100,u0,v0,u1,v1,u2,v2,u3,v3})

-- 批量绘制
obj.drawpoly(vertices)

-- 顶点列表方式绘制三角形
vertex={}
table.insert(vertex,{0,  0,  0, 0,0})
table.insert(vertex,{100,0,  0, 1,0})
table.insert(vertex,{100,100,0, 1,1})
obj.drawpoly(vertex)
vertex={}
for z=100,1000,100 do
    table.insert(vertex,{0,  0,  z, 1,1,1,1})
    table.insert(vertex,{100,0,  z, 1,1,1,1})
    table.insert(vertex,{100,100,z, 1,1,1,1})
end
obj.drawpoly(vertex,3)  -- 3表示三角形
```

**参数：**
- `vertex_num` (可选): 面顶点数 (4=四边形, 3=三角形)
- `alpha` (可选): 不透明度

**支持的表格格式：**
- 四边形格式: `{x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3,u0,v0,u1,v1,u2,v2,u3,v3}`
- 带法线: `{x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3,u0,v0,u1,v1,u2,v2,u3,v3,vx0,vy0,vz0,vx1,vy1,vz1,vx2,vy2,vz2,vx3,vy3,vz3}`
- 颜色模式: `{x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3,r0,g0,b0,a0,r1,g1,b1,a1,r2,g2,b2,a2,r3,g3,b3,a3}`
- 完整格式: `{x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3,r0,g0,b0,a0,r1,g1,b1,a1,r2,g2,b2,a2,r3,g3,b3,a3,vx0,vy0,vz0,vx1,vy1,vz1,vx2,vy2,vz2,vx3,vy3,vz3}`
- 顶点列表格式: `{x,y,z,u,v}` 或 `{x,y,z,u,v,vx,vy,vz}` 或 `{x,y,z,r,g,b,a}` 或 `{x,y,z,r,g,b,a,vx,vy,vz}`

### 图像加载

#### obj.load([type],...)

加载当前对象的图像。

```lua
-- 自动类型识别
obj.load("image.jpg")

-- 指定类型加载
obj.load("image", "photo.png")
```

**支持的类型：**

**视频文件**
```lua
obj.load("movie", "video.avi"[, time])
```
- `time` (可选): 指定时间(秒)，省略时使用对象当前时间
- **返回值**: 视频总时长(秒)

**图像文件**
```lua
obj.load("image", "photo.png")
```

**文本渲染**
```lua
obj.load("text", "Hello World"[, speed, time])
```
- `speed` (可选): 每秒显示字符数
- `time` (可选): 相对于speed的经过时间

**图形绘制**
```lua
obj.load("figure", name[, color, size, line, round])
```
- `name`: 图形名称或SVG文件名
- `color`: 颜色值 (0x000000~0xffffff)
- `size`: 图形大小
- `line`: 线条宽度
- `round`: 是否圆角 (true/false)

**帧缓冲区**
```lua
obj.load("framebuffer"[, x, y, w, h, alpha])
```
- `x,y,w,h` (可选): 获取范围，省略时为全部
- `alpha`: 是否保持透明度 (true/false)

**虚拟缓冲区**
```lua
obj.load("tempbuffer"[, x, y, w, h])
```

**图层对象**
```lua
obj.load("layer", layerNo[, effect])
```
- `layerNo`: 图层编号 (1~)
- `effect`: 是否应用特效 (true/false)

**前一个对象**
```lua
obj.load("before")
```

### 字体设置

#### obj.setfont(name, size[, type, col1, col2])

设置文本渲染字体。

```lua
-- 基本设置
obj.setfont("微软雅黑", 24)

-- 完整设置
obj.setfont("Arial", 36, 1, 0x000000, 0x888888)
```

**参数：**
- `name`: 字体名称
- `size`: 字体大小
- `type` (可选): 文字装饰类型 (0-6)
- `col1` (可选): 文字颜色
- `col2` (可选): 阴影/描边颜色

**装饰类型：**
- `0`: 标准文字
- `1`: 带影文字
- `2`: 带影文字(薄)
- `3`: 描边文字
- `4`: 描边文字(细)
- `5`: 描边文字(粗)
- `6`: 描边文字(角)

### 随机数生成

#### obj.rand(st_num, ed_num[, seed, frame])

生成随机数。与普通随机数不同，在同一时间的帧中始终生成相同的值。

```lua
-- 基本随机数
local value = obj.rand(1, 100)

-- 带种子控制的随机数
local value = obj.rand(0, 255, 12345)
```

**参数：**
- `st_num`: 最小值
- `ed_num`: 最大值
- `seed` (可选): 随机数种子
- `frame` (可选): 帧号

**兼容性：** 可省略 `obj.` 直接使用 `rand()`

### 选项设置

#### obj.setoption(name, value)

设置对象的各种选项。

```lua
-- 隐藏背面
obj.setoption("culling", 1)

-- 设置混合模式
obj.setoption("blend", "add")

-- 设置绘制目标
obj.setoption("drawtarget", "tempbuffer", 1920, 1080)
```

**主要选项：**

**显示选项**
- `culling`: 背面显示 (0=显示, 1=隐藏)
- `billboard`: 朝向相机 (0=不朝向, 1=仅横向, 2=仅纵向, 3=朝向)

**混合模式**
- `blend`: 合成模式
  - `"none"`: 普通
  - `"add"`: 加算
  - `"sub"`: 减算
  - `"mul"`: 乘算
  - `"screen"`: 屏幕
  - `"overlay"`: 叠加
  - `"light"`: 比较(明)
  - `"dark"`: 比较(暗)
  - `"brightness"`: 亮度
  - `"chroma"`: 色差
  - `"shadow"`: 阴影
  - `"light_dark"`: 明暗
  - `"diff"`: 色差

**缓冲区选项**
- `drawtarget`: 绘制目标
  - `"tempbuffer"[,width,height]: 虚拟缓冲区
  - `"framebuffer"`: 帧缓冲区

**相机选项**
- `camera_param`: 相机参数 (仅相机效果可用)

**其他选项**
- `draw_state`: 绘制状态 (true/false)
- `focus_mode`: 焦点框模式
- `sampler`: 采样器模式 ("clip"/"clamp"/"loop")

### 信息获取

#### obj.getoption(name,...)

获取对象的各种选项信息。

```lua
-- 获取GUI显示状态
local gui_visible = obj.getoption("gui")

-- 获取相机参数
local cam = obj.getoption("camera_param")

-- 获取脚本名
local script_name = obj.getoption("script_name")
```

**主要选项：**
- `track_mode`: 轨道条移动模式
- `section_num`: 对象区间数
- `script_name`: 脚本名称
- `gui`: GUI显示状态
- `camera_mode`: 相机控制状态
- `camera_param`: 相机参数
- `multi_object`: 多对象启用状态

#### obj.getinfo(name,...)

获取环境信息。

```lua
-- 获取脚本文件夹路径
local script_path = obj.getinfo("script_path")

-- 检查是否正在输出视频
local saving = obj.getinfo("saving")

-- 获取应用启动时间
local clock = obj.getinfo("clock")

-- 获取脚本处理时间
local script_time = obj.getinfo("script_time")
```

**主要选项：**
- `script_path`: 脚本文件夹路径
- `saving`: 是否正在输出视频 (true/false)
- `image_max`: 最大图像尺寸 (width, height)
- `clock`: 应用启动后的经过时间(秒)
- `script_time`: 脚本执行开始后的经过时间(毫秒)

#### obj.getvalue(target[, time, section])

获取对象的值。

```lua
-- 获取轨道条值
local track_value = obj.getvalue(0)
local custom_value = obj.getvalue("x")

-- 获取特定时间的值
local past_value = obj.getvalue("zoom", 5.0)
```

**参数：**
- `target`: 设置类型 (0-3, "x", "y", "z", "rx", "ry", "rz", "cx", "cy", "cz", "zoom", "alpha", "aspect", "time", "layer*")
- `time` (可选): 特定时间点
- `section` (可选): 区间编号

### 像素操作

#### obj.getpixel(x, y[, type])

获取对象的像素信息。

```lua
-- 获取颜色和透明度
local col, alpha = obj.getpixel(100, 100, "col")

-- 获取RGBA值
local r, g, b, a = obj.getpixel(100, 100, "rgb")

-- 获取图像尺寸
local width, height = obj.getpixel()
```

**参数：**
- `x,y`: 像素坐标
- `type` (可选): 信息类型
  - `"col"`: 颜色和透明度
  - `"rgb"`: RGBA值
  - `"yc"`: YCbCr值

**返回值：**
- 无参数: 图像宽度和高度
- `type="col"`: 颜色值(0x000000~0xffffff), 透明度(0.0~1.0)
- `type="rgb"`: R,G,B,A 值 (0~255)
- `type="yc"`: Y,Cb,Cr,A 值

::: tip 像素操作应用场景
- **图像分析**: 检测图像特定区域的颜色
- **动态效果**: 根据像素值创建响应式动画
- **遮罩效果**: 基于像素信息创建不规则遮罩
- **粒子系统**: 从图像生成粒子效果
:::

::: warning 性能注意事项
- 像素操作相对耗费性能，尽量减少调用频率
- 对于大图像，考虑使用缓存机制
- 避免在循环中频繁调用
:::

#### obj.putpixel(x,y,...)

写入对象的像素信息。

```lua
-- 写入颜色和透明度
obj.putpixel(100, 100, 0xff0000, 0.8)

-- 写入RGBA值
obj.putpixel(100, 100, 255, 0, 0, 128)

-- 写入YCbCr值
obj.putpixel(100, 100, y, cb, cr, a)
```

**参数：**
- `x,y`: 写入的像素坐标
- 像素信息类型取决于 `obj.pixeloption("type")` 的设置
  - `type="col"`: 颜色值(0x000000~0xffffff), 透明度(0.0~1.0)
  - `type="rgb"`: R,G,B,A 值 (0~255)
  - `type="yc"`: Y,Cb,Cr,A 值

#### obj.copypixel(dst_x, dst_y, src_x, src_y)

复制对象的像素信息。

```lua
-- 复制像素
obj.copypixel(200, 200, 100, 100)
```

**参数：**
- `dst_x,dst_y`: 复制目标坐标
- `src_x,src_y`: 复制源坐标

#### obj.pixeloption(name, value)

设置像素操作的处理选项。

```lua
-- 设置像素信息类型
obj.pixeloption("type", "rgb")

-- 设置读取源
obj.pixeloption("get", "framebuffer")

-- 设置写入目标
obj.pixeloption("put", "object")

-- 设置混合类型
obj.pixeloption("blend", 0)
```

**参数：**
- `name`: 选项名
- `value`: 选项值

**主要选项：**
- `type`: 像素信息类型 ("col"/"rgb"/"yc")
- `get`: 读取源 ("object"/"framebuffer")
- `put`: 写入目标 ("object"/"framebuffer")
- `blend`: 混合类型 (0=替换, 1=加算, 2=减算, 3=乘算)

### 音频处理

#### obj.getaudio(buf, file, type, size)

从音声文件获取音频数据。

```lua
-- 获取PCM数据
local n, rate = obj.getaudio(buf, "audio.wav", "pcm", 1000)

-- 获取频谱数据
local n, rate = obj.getaudio(buf, "audiobuffer", "spectrum", 32)

-- 获取傅里叶变换数据
local n, rate, buf = obj.getaudio(nil, "audio.wav", "fourier", 0)
```

**参数：**
- `buf`: 数据接收表格 (nil时通过返回值获取)
- `file`: 音声文件路径 ("audiobuffer"表示编辑中的音声数据)
- `type`: 数据类型
  - `"pcm"`: PCM采样数据
  - `"spectrum"`: 频率频谱数据
  - `"fourier"`: 傅里叶变换数据
- `size`: 获取数据数量

**返回值：**
- `获取数量, 采样率[, 数据表格]`

### 缓冲区操作

#### obj.copybuffer(dst, src)

复制图像缓冲区。

```lua
-- 对象 -> 虚拟缓冲区
obj.copybuffer("tempbuffer", "object")

-- 虚拟缓冲区 -> 对象
obj.copybuffer("object", "tempbuffer")

-- 帧缓冲区 -> 缓存缓冲区
obj.copybuffer("cache:buffer1", "framebuffer")

-- 图像文件 -> 对象
obj.copybuffer("object", "image:photo.png")
```

**参数：**
- `dst`: 目标缓冲区
- `src`: 源缓冲区

**缓冲区类型：**
- `"tempbuffer"`: 虚拟缓冲区
- `"object"`: 当前对象
- `"framebuffer"`: 帧缓冲区
- `"cache:name"`: 缓存缓冲区
- `"image:path"`: 图像文件

#### obj.clearbuffer(target[, color])

清除图像缓冲区。

```lua
-- 清除虚拟缓冲区为透明
obj.clearbuffer("tempbuffer")

-- 清除对象为白色
obj.clearbuffer("object", 0xffffff)
```

**参数：**
- `target`: 目标缓冲区
- `color` (可选): 清除颜色，省略时为透明

### 着色器操作

#### obj.pixelshader(name, target, resource, constant, blend)

执行像素着色器。

```lua
-- 简单着色器调用
obj.pixelshader("psmain", "object", nil, {bright/100}, "add")

-- 带纹理的着色器
obj.pixelshader("psmain", "object", "tempbuffer", {time, 0.5}, "copy")
```

**参数：**
- `name`: 着色器名称
- `target`: 输出目标缓冲区
- `resource`: 引用缓冲区 (数组或单个缓冲区名)
- `constant`: 常量数组 (传递给着色器的参数)
- `blend`: 混合方式

**混合方式：**
- `"copy"`: 直接复制
- `"mask"`: 仅使用透明度
- `"draw"`: 透明度混合
- `"add"`: 加算合成

#### obj.computeshader(name, target, resource, constant, countX, countY, countZ)

执行计算着色器。

```lua
-- 计算着色器调用
obj.computeshader("csmain", {"object"}, {"tempbuffer"}, {time}, 32, 32, 1)
```

### 轨道条操作

#### obj.getpoint(target[, option])

获取轨道条的值。

```lua
-- 获取指定区间的轨道条值
local value = obj.getpoint(0)

-- 获取当前区间的索引
local index = obj.getpoint("index")

-- 获取区间的总数
local num = obj.getpoint("num")

-- 获取当前时间
local time = obj.getpoint("time")

-- 检查是否设置了加速
local accelerate = obj.getpoint("accelerate")

-- 检查是否设置了减速
local decelerate = obj.getpoint("decelerate")

-- 获取轨道条参数
local param = obj.getpoint("param")

-- 获取相关轨道的索引和总数
local index, num = obj.getpoint("link")

-- 获取时间控制的值
local time_value = obj.getpoint("timecontrol", "time")

-- 获取帧率
local framerate = obj.getpoint("framerate")
```

**参数：**
- `target`: 获取目标
- `option` (可选): 附加选项

### 锚点操作

#### obj.setanchor(name, num[, option,...])

显示和控制锚点。

```lua
-- 基本锚点设置
obj.setanchor("pos", 3)

-- 带选项的锚点
local count = obj.setanchor("track", 0, "line", "color", 0xff0000)
```

**参数：**
- `name`: 坐标变量名或 "track"
- `num`: 锚点数量
- `option`: 各种选项

**主要选项：**
- `"line"`: 连接锚点的线条
- `"loop"`: 循环连接锚点
- `"star"`: 中心点连接
- `"arm"`: 锚点到中心连接
- `"color"`: 设置线条颜色
- `"inout"`: IN/OUT两侧显示
- `"xyz"`: 3D坐标控制

### 数学工具

#### obj.interpolation(time, x0,y0,z0, x1,y1,z1, x2,y2,z2, x3,y3,z3)

计算连续点之间的插值。

```lua
-- 2D插值
local x, y = obj.interpolation(t, x0,y0, x1,y1, x2,y2, x3,y3)

-- 3D插值
local x, y, z = obj.interpolation(t, x0,y0,z0, x1,y1,z1, x2,y2,z2, x3,y3,z3)
```

**参数：**
- `time`: 时间参数 (0.0~1.0)
- `x0,y0,z0` ~ `x3,y3,z3`: 四个控制点的坐标

#### RGB(r,g,b) / RGB(color)

颜色值与RGB分量的相互转换。

```lua
-- RGB转颜色值
local color = RGB(255, 0, 0)

-- 颜色值转RGB
local r, g, b = RGB(0xff0000)

-- 时间变化的颜色
local color = RGB(255,0,0, 0,255,0)
```

#### HSV(h,s,v) / HSV(color)

颜色值与HSV分量的相互转换。

```lua
-- HSV转颜色值
local color = HSV(0, 100, 100)

-- 颜色值转HSV
local h, s, v = HSV(0xff0000)

-- 时间变化的颜色
local color = HSV(0,100,100, 120,100,100)
```

#### OR(a,b) / AND(a,b) / XOR(a,b)

位运算函数。

```lua
local result_or = OR(a, b)
local result_and = AND(a, b)
local result_xor = XOR(a, b)
```

#### SHIFT(a, shift)

移位运算。

```lua
-- 左移位
local result = SHIFT(value, 2)

-- 右移位
local result = SHIFT(value, -1)
```

#### rotation(x0,y0,x1,y1,x2,y2,x3,y3,zoom,r)

坐标旋转变换。

```lua
-- 旋转四个顶点坐标
local x0,y0,x1,y1,x2,y2,x3,y3 = rotation(x0,y0,x1,y1,x2,y2,x3,y3,1.0,45)
```

### 调试工具

#### debug_print(text)

输出调试信息到日志。

```lua
debug_print("当前时间: " .. obj.time)
debug_print(string.format("位置: (%.2f, %.2f)", obj.ox, obj.oy))
```

**参数：**
- `text`: 调试信息文本

## 使用示例

### 基础示例

#### 文本中的脚本使用

```
当前对象时间=<?mes(string.format("%02d:%02d.%02d",obj.time/60,obj.time%60,(obj.time*100)%100))?>
```

#### 时间变化动画

```lua
-- 随时间向右移动并旋转
obj.ox = obj.ox + obj.time * 10
obj.rz = obj.rz + obj.time * 360
```

#### 特效应用

```lua
-- 亮度呼吸效果
local intensity = math.cos(obj.time * math.pi * 2) * 50
obj.effect("色调校正", "亮度", 100 + intensity)
```

### 中级示例

#### 粒子系统

```lua
--track@particle_count:粒子数量,10,1000,100
--track@speed:速度,0.1,10,1
--color@particle_color:粒子颜色,0xffffff

obj.setoption("drawtarget", "tempbuffer", 1920, 1080)

for i = 1, particle_count do
    local seed = 1000 + i
    local x = obj.rand(-obj.w/2, obj.w/2, seed)
    local y = obj.rand(-obj.h/2, obj.h/2, seed + 1)
    local life = obj.time * speed - obj.rand(0, 100, seed + 2) / 10

    if life > 0 then
        local alpha = math.min(1.0, life * 0.1)
        obj.draw(x, y, 0, 0.1, alpha)
    end
end

obj.load("tempbuffer")
obj.setoption("drawtarget", "framebuffer")
```

#### 多边形动画

```lua
--value@radius:半径,100
--track@rotation_speed:旋转速度,0,10,1
--track@vertex_count:顶点数量,3,20,6

local vertices = {}

for i = 0, vertex_count - 1 do
    local angle = (i / vertex_count + obj.time * rotation_speed) * 2 * math.pi
    local x = math.cos(angle) * radius
    local y = math.sin(angle) * radius
    table.insert(vertices, {x, y, 0})
end

-- 闭合多边形
local last = vertices[#vertices]
table.insert(vertices, {last[1], last[2], 0})

obj.drawpoly(vertices)
```

### 高级示例

#### 像素着色器使用

```lua
--track@bright:亮度,-100,100,0,0.01

--[[pixelshader@psmain:
cbuffer constant0 : register(b0) {
    float bright;
};
float4 psmain(float4 pos : SV_Position) : SV_Target {
    return float4(bright, bright, bright, 1);
}
]]

obj.pixelshader("psmain", "object", nil, {bright/100}, "add")
```

#### 音频可视化

```lua
--value@bar_count:柱状图数量,32
--track@sensitivity:灵敏度,0.1,5,1

local buf = {}
local n = obj.getaudio(buf, "audiobuffer", "spectrum", bar_count)

obj.setoption("drawtarget", "tempbuffer", obj.w, obj.h)
obj.clearbuffer("tempbuffer", 0x000000)

for i = 1, n do
    local height = buf[i] * sensitivity * obj.h
    local x = (i - 1) * (obj.w / bar_count)
    local y = obj.h - height

    -- 绘制频谱条
    obj.load("figure", "四角形", 0x00ff00, obj.w / bar_count, 0, false)
    obj.draw(x, y)
end

obj.load("tempbuffer")
obj.setoption("drawtarget", "framebuffer")
```

#### 3D 旋转效果

```lua
--track@rotate_x:X轴旋转,0,360,0
--track@rotate_y:Y轴旋转,0,360,0
--track@rotate_z:Z轴旋转,0,360,0
--track@distance:距离,100,1000,300

-- 设置锚点用于3D控制
obj.setanchor("track", 0, "xyz")

-- 应用旋转
obj.rx = rotate_x
obj.ry = rotate_y
obj.rz = rotate_z

-- 调整距离
obj.oz = distance
```

#### 波浪文字效果

```lua
--font@main_font:字体,微软雅黑
--value@text:文本内容,"Hello World"
--track@wave_speed:波浪速度,0,5,1
--track@wave_height:波浪高度,0,50,20

obj.setfont(main_font, 48, 0, 0x000000, 0xffffff)

for i = 1, #text do
    local char = string.sub(text, i, i)
    local x = (i - 1) * 40
    local wave = math.sin((obj.time * wave_speed + i * 0.5)) * wave_height
    local y = wave

    obj.load("text", char)
    obj.draw(x, y)
end
```

#### 多对象脚本

```lua
--@particle_system
--track@count:粒子数,10,100,50
--color@color:粒子颜色,0xffffff

if obj.index == 0 then
    -- 主对象：管理粒子
    obj.setoption("drawtarget", "tempbuffer", 1920, 1080)
    obj.clearbuffer("tempbuffer")
else
    -- 粒子对象：绘制单个粒子
    local angle = (obj.index / obj.num) * 2 * math.pi + obj.time * 2
    local radius = 100 + math.sin(obj.time + obj.index) * 50
    obj.ox = math.cos(angle) * radius
    obj.oy = math.sin(angle) * radius
    obj.load("figure", "圆", color, 10)
    obj.draw()
end

if obj.index == obj.num - 1 then
    -- 最后对象：显示结果
    obj.load("tempbuffer")
    obj.setoption("drawtarget", "framebuffer")
end

--@main
-- 其他脚本内容
```

## 高级技巧

### 性能优化

1. **减少绘制调用**: 使用 `obj.drawpoly()` 批量绘制代替多次 `obj.draw()`
2. **避免不必要的计算**: 在循环外计算常量值
3. **使用虚拟缓冲区**: 复杂效果先渲染到虚拟缓冲区再输出
4. **合理使用随机数**: 避免在每帧都重新生成随机数
5. **像素操作优化**: 减少 `getpixel`/`putpixel` 的调用频率

### 内存管理

```lua
-- 避免在循环中重复创建表格
local vertices = {}
for i = 1, 1000 do
    vertices[i] = {x = i * 10, y = 0, z = 0}
end
obj.drawpoly(vertices)
```

### 错误处理

```lua
-- 安全的文件加载
local function safe_load(filename)
    local success, result = pcall(function()
        return obj.load("image", filename)
    end)

    if not success then
        obj.load("text", "加载失败: " .. filename)
    end
end
```

### 数学技巧

```lua
-- 平滑插值
local function smooth_step(edge0, edge1, x)
    x = math.max(0, math.min(1, (x - edge0) / (edge1 - edge0)))
    return x * x * (3 - 2 * x)
end

-- 缓动函数
local function ease_out_cubic(t)
    return 1 - math.pow(1 - t, 3)
end

-- 使用示例
local t = obj.time / 2
obj.ox = smooth_step(0, 200, t)
```

## 故障排除

### 常见问题

**Q: 脚本无法加载？**
- A: 检查脚本文件编码是否为UTF-8，路径是否正确，语法是否有误。

**Q: 效果没有显示？**
- A: 确认对象类型是否支持该效果，参数是否正确，脚本执行顺序是否正确。

**Q: 性能很差？**
- A: 优化绘制调用，减少不必要的计算，考虑使用虚拟缓冲区，避免频繁的像素操作。

**Q: 随机数不随机？**
- A: 这是正常行为，同一帧的随机数应该相同。使用不同的种子或帧号。

**Q: 着色器不工作？**
- A: 检查着色器语法是否正确，入口点函数名是否与注册名一致。

### 调试技巧

```lua
-- 输出调试信息
obj.load("text", string.format("time: %.2f", obj.time))

-- 条件调试
if obj.frame == 60 then
    -- 在第60帧时的调试代码
end

-- 范围检查
if obj.ox < -1000 or obj.ox > 1000 then
    debug_print("对象位置异常: " .. obj.ox)
end
```

## 更新历史

### 程序更新历史

- **2025/9/21**
  - 添加文本设置项目 (`--text@`)
  - 新增 `obj.getvalue()` 对基准中心坐标的支持
  - `obj.drawpoly()` 新增顶点列表绘制方法
  - `obj.getinfo()` 新增环境信息获取功能
  - 修复 `obj.getvalue("layer.x")` 在指定图层无对象时的处理
  - 修复场景变换脚本中 `obj.setanchor()` 的使用

- **2025/9/13**
  - 修复脚本控制和脚本文件对包含库的选择
  - 修复 `obj.copybuffer()` 更新对象时部分 `obj` 变量未正确更新
  - 修复 `obj.layer` 值反映绘制目标对象的图层位置
  - 修复 `obj.drawpoly()` 数组指定时的坐标渲染
  - 新增 `obj.getinfo("clock")` 和 `obj.getinfo("script_time")` 函数

- **2025/9/7**
  - 修复 `obj.setanchor()` 对直接表格变量指定时的崩溃
  - 修复脚本控制中不必要的 Lua 库函数包含

- **2025/8/30**
  - 修复轨道条移动脚本中 `obj.rand()` 默认种子计算的问题
  - 修复文本单独对象显示时机未反映到 `obj` 变量的问题

- **2025/8/24**
  - 修复输出日志可能导致崩溃的问题
  - 改进 `obj.getpixel()` 的缓存处理并添加处理说明
  - 新增 `obj.putpixel()` 和 `obj.copypixel()` 函数
  - 扩展 `obj.pixeloption()` 选项
  - 修复 `obj.setoption()` 合成模式的部分处理问题

- **2025/8/10**
  - 修复 `obj.copybuffer()` 在复制图像文件时不能正确反映的问题
  - 修复更新对象时 `obj` 变量未更新的问题
  - 修复对象图像不存在时 `obj.drawpoly()` 可能导致崩溃的问题

- **2025/8/3**
  - 添加 `obj.effect()` 参数值为数值类型时的处理措施

- **2025/7/27**
  - 修复虚拟缓冲区和缓存缓冲区不能正确生成的问题

- **2025/7/12**
  - 新增 `copybuffer()` 函数的复制目标类型

### 文档更新历史

- **2025/9/21** v3.0.1 - 更新至最新官方文档
  - 添加文本设置项目 (`--text@`)
  - 新增 `obj.getvalue()` 对基准中心坐标的支持
  - 扩展 `obj.drawpoly()` 的顶点列表绘制方法
  - 添加 `obj.getinfo()` 的环境信息获取功能
  - 更新内置变量 `obj.layer` 的说明
  - 完善像素操作函数说明
  - 更新重要注意事项，添加库限制说明
  - 完整更新程序更新历史至最新版本

- **2025/8/24** v3.0 - 完整重构，基于最新官方文档
  - 合并 lua.txt 和 lua-script-guide2.md 的所有内容（已合并至本文档）
  - 新增像素操作、音频处理、着色器操作等最新功能
  - 扩展使用示例和高级技巧
  - 完善错误处理和性能优化建议

- **2024/08/22** v2.0 - 文档重构
  - 补充完整的像素操作函数
  - 添加锚点操作说明
  - 完善所有使用示例
  - 优化文档结构和格式
  - 添加高级技巧章节

- **2023/XX/XX** v1.0 - 初始版本发布
  - 基于官方文档翻译整理
  - 基础功能说明
  - 基本使用示例

---

::: info 贡献
发现文档错误或有改进建议？欢迎提交 Issue 或 Pull Request。

**文档源码**: [文档仓库](https://github.com/gasdyueer/learnvite)
:::