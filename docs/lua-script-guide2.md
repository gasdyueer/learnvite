---
title: Lua 脚本指南 v2.0 - 完整参考手册
description: AviUtl 扩展编辑器 Lua 脚本的完整参考指南，包含所有函数、变量和使用示例
outline: deep
---

# Lua 脚本指南 v2.0

::: info 版本信息
- **文档版本**: 2.0
- **最后更新**: 2024年8月22日
- **适用版本**: AviUtl 扩展编辑器
- **语言支持**: Lua / LuaJIT
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
  - [锚点操作](#锚点操作)
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

::: tip 提示
支持在 Script 文件夹的子文件夹中组织脚本文件，便于管理。
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
| `obj.layer` | 只读 | 所在图层 |
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

#### obj.drawpoly({table}[,alpha])

使用表格形式批量绘制多个四边形。

```lua
local vertices = {}

-- 添加第一个四边形
table.insert(vertices, {x0,y0,0,x1,y1,0,x2,y2,0,x3,y3,0,u0,v0,u1,v1,u2,v2,u3,v3})

-- 添加第二个四边形
table.insert(vertices, {x0,y0,100,x1,y1,100,x2,y2,100,x3,y3,100,u0,v0,u1,v1,u2,v2,u3,v3})

-- 批量绘制
obj.drawpoly(vertices)
```

**支持的表格格式：**
- 基础格式: `{x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3,u0,v0,u1,v1,u2,v2,u3,v3}`
- 带法线: `{x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3,u0,v0,u1,v1,u2,v2,u3,v3,vx0,vy0,vz0,vx1,vy1,vz1,vx2,vy2,vz2,vx3,vy3,vz3}`
- 颜色模式: `{x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3,r0,g0,b0,a0,r1,g1,b1,a1,r2,g2,b2,a2,r3,g3,b3,a3}`
- 完整格式: `{x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3,r0,g0,b0,a0,r1,g1,b1,a1,r2,g2,b2,a2,r3,g3,b3,a3,vx0,vy0,vz0,vx1,vy1,vz1,vx2,vy2,vz2,vx3,vy3,vz3}`

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
- `target`: 设置类型 (0-3, "x", "y", "z", "rx", "ry", "rz", "zoom", "alpha", "aspect", "time", "layer*")
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

#### obj.pixeloption(name, value)

设置像素操作的处理选项。

```lua
-- 设置像素信息类型
obj.pixeloption("type", "rgb")
```

**参数：**
- `name`: 选项名
- `value`: 选项值

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

## 高级技巧

### 性能优化

1. **减少绘制调用**: 使用 `obj.drawpoly()` 批量绘制代替多次 `obj.draw()`
2. **避免不必要的计算**: 在循环外计算常量值
3. **使用虚拟缓冲区**: 复杂效果先渲染到虚拟缓冲区再输出
4. **合理使用随机数**: 避免在每帧都重新生成随机数

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
```

## 故障排除

### 常见问题

**Q: 脚本无法加载？**
A: 检查脚本文件编码是否为UTF-8，路径是否正确。

**Q: 效果没有显示？**
A: 确认对象类型是否支持该效果，参数是否正确。

**Q: 性能很差？**
A: 优化绘制调用，减少不必要的计算，考虑使用虚拟缓冲区。

**Q: 随机数不随机？**
A: 这是正常行为，同一帧的随机数应该相同。使用不同的种子或帧号。

### 调试技巧

```lua
-- 输出调试信息
obj.load("text", string.format("time: %.2f", obj.time))

-- 条件调试
if obj.frame == 60 then
    -- 在第60帧时的调试代码
end
```

## 更新历史

- **2024/08/22** v2.0 - 完整重构文档
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

**项目地址**: [GitHub 链接]
**文档源码**: [文档仓库]
:::