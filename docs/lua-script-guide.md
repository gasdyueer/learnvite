# Lua 脚本指南

## 关于 Lua 脚本

脚本控制、脚本文件（*.anm2, *.obj2, *.cam2, *.scn2, *.tra2）以及文本的脚本控制字符中，可以使用 Lua 语言。此外，还扩展了一些变量和函数。
※旧脚本文件（*.anm, *.obj, *.cam, *.scn, *.tra）也可以使用，但部分功能不受支持。

## 注意点

::: tip 注意
- 脚本的字符编码为 UTF-8。※旧脚本文件的字符编码为 SJIS。
- 脚本的存放位置为 `ProgramData\aviutl2\Script\` 文件夹（及其下一级文件夹）。
- 从一个脚本调用另一个脚本可能无法正常工作。
- 执行“丢弃缓存”操作会重新加载脚本（包括着色器），但设置项的更改不会被反映。
- 旧脚本文件格式的 `pixel` 输出系列函数不受支持。※可以改用着色器。
:::

## 设置项目

在脚本文件的开头指定以下内容可以添加设置项目。

::: details 轨道条项目定义
通过在脚本文件开头使用 `'--track@变量名:项目名,最小值,最大值,默认值,移动单位'` 的格式，可以启用轨道条。移动单位可以是 '1', '0.1', '0.01', '0.001' 或省略。
※旧脚本文件格式的 `'--track0:项目名,最小值,最大值,默认值,移动单位'` 也可以使用。

```lua
--track@vx:X速度,-10,10,0
obj.ox = obj.ox + vx * obj.time
```
:::

::: details 复选框项目定义
通过在脚本文件开头使用 `'--check@变量名:项目名,默认值(0或1)'` 的格式，可以启用复选框。
※旧脚本文件格式的 `'--check0:项目名,默认值(0或1)'` 也可以使用。

```lua
--check@grav:重力,0
if( grav ) then
```
:::

::: details 颜色设置项目定义
通过在脚本文件开头使用 `'--color@变量名:项目名,默认值'` 的格式，可以启用颜色设置项目。
将默认值指定为 `nil` 可以选择透明色。
※旧脚本文件格式的 `'--color:默认值'` 也可以使用。

```lua
--color@col:图形颜色,0xffffff
obj.load("figure","四角形",col,100)
```
:::

::: details 文件选择项目定义
通过在脚本文件开头使用 `'--file@变量名:项目名'` 的格式，可以启用文件选择项目。
※旧脚本文件格式的 `'--file:'` 也可以使用。

```lua
--file@path:图像文件
obj.load("image",path)
```
:::

::: details 字体设置项目定义
通过在脚本文件开头使用 `'--font@变量名:项目名,默认值'` 的格式，可以启用字体设置项目。

```lua
--font@font:字体名,MS UI Gothic
obj.setfont(font,50,deco,col1,col2)
```
:::

::: details 图形设置项目定义
通过在脚本文件开头使用 `'--figure@变量名:项目名,默认值'` 的格式，可以启用图形设置项目。

```lua
--figure@fig:前端图形,三角形
obj.load("figure",fig,col,100)
```
:::

::: details 列表选择项目定义
通过在脚本文件开头使用 `'--select@变量名:项目名=默认值,选项=值,选项=值,选项=值'` 的格式，可以启用列表选择项目。默认值可以省略。

```lua
--select@deco:装饰类型,标准文字=0,带影文字=1,带影文字(薄)=2,描边文字=3,描边文字(细)=4,描边文字(粗)=5,描边文字(角)=6
obj.setfont(font,obj.track2,deco,col1,col2)
```
:::

::: details 变量项目定义
通过在脚本文件开头使用 `'--value@变量名:项目名,默认值'` 的格式，可以启用变量项目。
变量项目是文本输入项，可以定义数值、字符串和数组。
※根据默认值的内容切换类型。

```lua
--value@num:数值,0
--value@text:字符串,"0"
--value@table:数组,{0,0,0}
```
:::

::: details 对象添加菜单标签定义
通过在脚本文件开头使用 `'--label:标签名'` 的格式，可以设置对象添加菜单中层级标签的初始值。

```lua
--label:加工
```
:::

::: details 脚本类型指定
通过在脚本文件开头使用 `'--script:类型'` 的格式，可以指定脚本的类型（luaJIT, lua）。
如果未指定，则为 luaJIT。※旧脚本文件中为 lua。

```lua
--script:lua
```
:::

::: details 脚本信息指定
通过在脚本文件开头使用 `'--information:标签名'` 的格式，可以设置脚本的信息。

```lua
--information:测试脚本 ver2.00 by Kenkun
```
:::

::: details 像素着色器定义
在脚本文件开头的 `'--[[pixelshader@注册名:'` 这样的多行注释中，可以用 HLSL 编写像素着色器。
※注册名将作为入口点。

```hlsl
--[[pixelshader@psmain:
    float4 psmain(float4 pos : SV_Position) : SV_Target {
        ...
    }
]]
```
:::

::: details 计算着色器定义
在脚本文件开头的 `'--[[computeshader@注册名:'` 这样的多行注释中，可以用 HLSL 编写计算着色器。
※注册名将作为入口点。

```hlsl
--[[computeshader@csmain:
    [numthreads(1, 1, 1)]
    void csmain(uint2 id : SV_DispatchThreadID) {
        ...
    }
]]
```
:::

※旧脚本文件格式的 `--dialog` 和 `--param` 也可以使用。它们会创建单独的设置项目。

## 变量

目标对象的信息存储在以下变量中。

- `obj.ox`: 相对于基准坐标的 X 坐标
- `obj.oy`: 相对于基准坐标的 Y 坐标
- `obj.oz`: 相对于基准坐标的 Z 坐标
- `obj.rx`: X 轴旋转角度 (360.0 为一圈)
- `obj.ry`: Y 轴旋转角度 (360.0 为一圈)
- `obj.rz`: Z 轴旋转角度 (360.0 为一圈)
- `obj.cx`: 中心的相对 X 坐标
- `obj.cy`: 中心的相对 Y 坐标
- `obj.cz`: 中心的相对 Z 坐标
- `obj.zoom`: 缩放率 (1.0 = 原始大小)
- `obj.alpha`: 不透明度 (0.0～1.0 / 0.0=透明 / 1.0=不透明)
- `obj.aspect`: 宽高比 (-1.0～1.0 / 正数=横向压缩 / 负数=纵向压缩)
- `obj.x`: 显示基准坐标 X (只读)
- `obj.y`: 显示基准坐标 Y (只读)
- `obj.z`: 显示基准坐标 Z (只读)
- `obj.w`: 图像宽度 (只读)
- `obj.h`: 图像高度 (只读)
- `obj.screen_w`: 屏幕宽度 (只读)
- `obj.screen_h`: 屏幕高度 (只读)
- `obj.framerate`: 帧率 (只读)
- `obj.frame`: 基于对象的当前帧号 (只读)
- `obj.time`: 基于对象的当前时间(秒) (只读)
- `obj.totalframe`: 对象的总帧数 (只读)
- `obj.totaltime`: 对象的总时间(秒) (只读)
- `obj.layer`: 对象所在的图层 (只读)
- `obj.index`: 多对象时的编号 (只读) ※用于单个对象
- `obj.num`: 多对象时的数量 (1=单个对象 / 0=不定) (只读) ※用于单个对象

## 函数

脚本中添加了以下函数。

::: details obj.mes(text)
在文本对象中添加指定的文本。只能在文本对象的文本内使用。
※也可以省略 `obj.` 直接使用 `mes()`。
- `text`: 要显示的文本。
`例：obj.mes("这段文字将被插入并显示")`
:::

::: details obj.effect([name,param1,value1,param2,value2,...])
执行指定的滤镜效果。仅媒体对象可用。
不带参数调用时，执行脚本之后的所有滤镜效果。
- `name`: 特效名称。
- `param1`: 特效参数名称。
- `value1`: 特效参数值。
`param?`, `value?` 的组合可以根据需要指定任意数量。
※轨道条、复选框以外的设置的 `param`, `value` 是通过别名文件等输出时的名称和值。
※旧脚本文件的参数会参照 `effect.conf` 的定义进行转换。不足的定义会适时添加。
`例：obj.effect("色调校正","亮度",150,"色相",180)`
:::

::: details obj.draw([ox,oy,oz,zoom,alpha,rx,ry,rz])
绘制当前对象。
通常情况下，即使不执行任何操作，对象最后也会被绘制，但使用 `obj.draw()` 可以多次绘制对象。
※使用 `obj.draw()` 时，脚本之后的滤镜效果将不会执行。
※可以通过不带参数调用 `obj.effect()` 来预先执行脚本之后的滤镜效果。
- `ox`: 相对坐标 X
- `oy`: 相对坐标 Y
- `oz`: 相对坐标 Z
- `zoom`: 缩放率 (1.0=原始大小)
- `alpha`: 不透明度 (0.0=透明 / 1.0=不透明)
- `rx`: X 轴旋转角度 (360.0 为一圈)
- `ry`: Y 轴旋转角度 (360.0 为一圈)
- `rz`: Z 轴旋转角度 (360.0 为一圈)
`例：obj.draw(2,10,0)`
:::

::: details obj.drawpoly(x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3[,u0,v0,u1,v1,u2,v2,u3,v3,alpha])
以任意四边形绘制当前对象的任意部分。
※内角全部小于180度的平面以外的部分无法正确绘制。
※顶点0到3按顺时针方向的面为正面。
※使用 `obj.drawpoly()` 时，脚本之后的滤镜效果将不会执行。
- `x0,y0,z0`: 四边形顶点0的坐标
- `x1,y1,z1`: 四边形顶点1的坐标
- `x2,y2,z2`: 四边形顶点2的坐标
- `x3,y3,z3`: 四边形顶点3的坐标
- `u0,v0`: 对应顶点0的对象图像坐标
- `u1,v1`: 对应顶点1的对象图像坐标
- `u2,v2`: 对应顶点2的对象图像坐标
- `u3,v3`: 对应顶点3的对象图像坐标
`例：obj.drawpoly(-50,-50,0, 50,-50,0, 50,50,0, -50,50,0, 0,0, obj.w,0, obj.w,obj.h, 0,obj.h)`
:::

::: details obj.drawpoly({table}[,alpha])
可以用表格形式指定多个 `obj.drawpoly()` 的参数。
比多次调用 `obj.drawpoly()` 绘制速度更快。
支持以下表格格式：
- `{x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3,u0,v0,u1,v1,u2,v2,u3,v3}`
- `{x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3,u0,v0,u1,v1,u2,v2,u3,v3,vx0,vy0,vz0,vx1,vy1,vz1,vx2,vy2,vz2,vx3,vy3,vz3}`
- `{x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3,r0,g0,b0,a0,r1,g1,b1,a1,r2,g2,b2,a2,r3,g3,b3,a3}`
- `{x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3,r0,g0,b0,a0,r1,g1,b1,a1,r2,g2,b2,a2,r3,g3,b3,a3,vx0,vy0,vz0,vx1,vy1,vz1,vx2,vy2,vz2,vx3,vy3,vz3}`
※`vx,vy,vz` 是法线向量
※`r,g,b,a` 是绘制颜色 (0.0～1.0 的预乘 Alpha) ※不使用对象图像
`例：`
`table.insert(vertex,{x0,y0,0,x1,y1,0,x2,y2,0,x3,y3,0,u0,v0,u1,v1,u2,v2,u3,v3})`
`table.insert(vertex,{x0,y0,100,x1,y1,100,x2,y2,100,x3,y3,100,u0,v0,u1,v1,u2,v2,u3,v3})`
`obj.drawpoly(vertex)`
:::

::: details obj.load([type],...)
加载当前对象的图像。
如果省略 `type`，将自动判断。
※已加载的图像将被丢弃。

- **视频文件**
  `obj.load("movie",file[,time])`
  从视频文件加载指定时间的图像。
  - `file`: 视频文件名
  - `time`: 显示图像的时间(秒) (省略时为对象的当前时间)
  - `返回值`: 视频总时间(秒)
  `例：obj.load("movie","c:\\test.avi")`

- **图像文件**
  `obj.load("image",file)`
  加载图像文件。
  - `file`: 图像文件名
  `例：obj.load("image","c:\\test.bmp")`

- **文本**
  `obj.load("text",text[,speed,time])`
  加载文本。
  可以使用颜色、大小和字体的控制字符。
  设置 `speed` 和 `time` 可以改变显示的字符数。
  ※不能用于文本对象。
  - `text`: 要加载的文本
  - `speed`: `time` 参数下每秒显示的字符数
  - `time`: 相对于 `speed` 参数的经过时间
  `例：obj.load("text","这段文字将作为图像加载")`

- **图形**
  `obj.load("figure",name[,color,size,line,round])`
  加载图形。
  - `name`: 图形名称、SVG 文件名
  - `color`: 颜色 (0x000000～0xffffff)
  - `size`: 图形大小
  - `line`: 图形线宽
  - `round`: 是否圆角 (true=是 / false<默认>=否)
  `例：obj.load("figure","圆",0xffffff,100,true)`

- **帧缓冲区**
  `load("framebuffer"[,x,y,w,h][,alpha])`
  从帧缓冲区加载。
  - `x,y,w,h`: 从帧缓冲区获取的范围 (省略时为全部)
  - `alpha`: 保持 Alpha 通道 (true=是 / false<默认>=否)

- **虚拟缓冲区**
  `load("tempbuffer"[,x,y,w,h])`
  从虚拟缓冲区加载。
  ※虚拟缓冲区可以通过 `obj.copybuffer()`, `obj.setoption()` 创建。
  - `x,y,w,h`: 从虚拟缓冲区获取的范围 (省略时为全部)

- **图层上的对象**
  `obj.load("layer",no[,effect])`
  加载指定图层上的对象。
  - `no`: 图层号 (1～)
  - `effect`: 执行附加效果 (true=是 / false<默认>=否)

- **前一个对象**
  `obj.load("before");`
  加载前一个对象。
  仅在自定义对象中，加载其他对象之前可用。
:::

::: details obj.setfont(name,size[,type,col1,col2])
指定 `obj.load()` 的文本所用字体。
※每次调用脚本都需要指定。
- `name`: 字体名称
- `size`: 字体大小
- `type`: 文字装饰 (0～6)
  - `0`: 标准文字
  - `1`: 带影文字
  - `2`: 带影文字(薄)
  - `3`: 描边文字
  - `4`: 描边文字(细)
  - `5`: 描边文字(粗)
  - `6`: 描边文字(角)
- `col1`: 文字颜色 (0x000000～0xffffff)
- `col2`: 阴影/描边颜色 (0x000000～0xffffff)
:::

::: details obj.rand(st_num,ed_num[,seed,frame])
生成随机数。与普通随机数不同，它会在同一时间的帧中始终生成相同的值。
※也可以省略 `obj.` 直接使用 `rand()`。
- `st_num`: 随机数最小值
- `ed_num`: 随机数最大值
- `seed`: 随机数种子 (省略时，每个对象有不同的随机数；正值时，即使种子相同，每个对象也不同；负值时，种子相同则所有对象相同)
- `frame`: 帧号 (省略时为当前帧)
`例：obj.rand(10,20)`
:::

::: details obj.setoption(name,value)
设置当前对象的各种选项。
※每次调用脚本都需要指定。
- `name`: 选项名
- `value`: 选项值

- **不显示背面**
  `obj.setoption("culling",value)`
  - `value`: `0`=显示 / `1`=不显示

- **朝向相机**
  `obj.setoption("billboard",value)`
  - `value`: `0`=不朝向 / `1`=仅横向 / `2`=仅纵向 / `3`=朝向

- **合成模式**
  `obj.setoption("blend",value[,option])`
  - `value`:
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
    - 以下是虚拟缓冲区专用合成模式：
    - `"alpha_add"`: 颜色信息加权平均，Alpha 值相加
    - `"alpha_max"`: 颜色信息加权平均，Alpha 值取较大者
    - `"alpha_sub"`: 颜色信息不变，Alpha 值相减
    - `"alpha_add2"`: 颜色信息叠加，Alpha 值相加
  ※旧脚本文件格式的数值指定也可以使用。
  ※使用合成模式会加重绘制处理负担。

- **将绘制目标更改为虚拟缓冲区**
  `obj.setoption("drawtarget","tempbuffer"[,w,h])`
  - `w,h`: 虚拟缓冲区大小 (省略时不初始化)
  将绘制目标设为虚拟缓冲区后，`obj.draw()` 和 `obj.drawpoly()` 的绘制将在虚拟缓冲区上进行。此时，对象自身的坐标等设置将不被反映，而是直接使用参数的坐标进行绘制。
  指定大小时，虚拟缓冲区将以透明色初始化。
  虚拟缓冲区为所有对象共用。

- **将绘制目标更改为帧缓冲区**
  `obj.setoption("drawtarget","framebuffer")`
  将 `obj.draw()` 和 `obj.drawpoly()` 的绘制目标设为帧缓冲区。
  如果未使用 `draw()` 等对帧缓冲区进行绘制，即使不通过 `setoption()` 更改，脚本结束后也会自动对帧缓冲区进行绘制。

- **更改脚本内是否已在帧缓冲区绘制的状态**
  `obj.setoption("draw_state",flag)`
  - `flag`: `true`=已绘制 / `false`=未绘制

- **对象的焦点框模式**
  `obj.setoption("focus_mode",value)`
  - `value`: `"fixed_size"`=固定大小的框

- **设置相机参数**
  设置相机的各种参数。
  当相机处于编辑模式时无效。
  ※仅相机效果可用
  `obj.setoption("camera_param",cam)`
  - `cam`: 相机参数 (table)
    - `.x, .y, .z`: 相机坐标
    - `.tx, .ty, .tz`: 相机目标坐标
    - `.rz`: 相机倾斜
    - `.ux, .uy, .uz`: 相机上方向单位向量
    - `.d`: 相机到屏幕的距离 (焦距)
  `例：cam = obj.getoption("camera_param");`

- **采样器模式**
  更改 `obj.draw()`, `obj.drawpoly()` 绘制时的采样器。
  `obj.setoption("sampler",value)`
  - `value`:
    - `"clip"`: 区域外为透明色
    - `"clamp"`: 区域外为最外侧颜色
    - `"loop"`: 区域外循环
:::

## 使用示例

### 在文本中使用脚本的示例
以下文本将显示对象时间的计时器。

```
当前对象时间=<?mes(string.format("%02d:%02d.%02d",obj.time/60,obj.time%60,(obj.time*100)%100))?>
```

### 随时间改变对象坐标和角度的示例
以下脚本使对象随时间向右移动并向右旋转。

```lua
obj.ox = obj.ox + obj.time*10
obj.rz = obj.rz + obj.time*360
```

### 对对象应用滤镜效果的示例
以下脚本使对象随时间变亮或变暗。

```lua
i = math.cos(obj.time*math.pi*2)*50
obj.effect("色调校正","亮度",100+i)
```

### 绘制多个对象的示例
以下脚本将对象以圆形排列绘制10个。

```lua
n = 10
l = obj.w*2
for i=0,n do
  r = 360*i/n
  x = math.sin(r*math.pi/180)*l
  y = -math.cos(r*math.pi/180)*l
  obj.draw(x,y,0,1,1,0,0,r)
end
```

## 更新历史

- **[2025/7/12] ver 2.00 beta2**
  - `copybuffer()` 添加了新的复制目标类型。
- **[2025/7/27] ver 2.00 beta4**
  - 修正了虚拟缓冲区和缓存缓冲区有时无法正确生成的问题。

## 关于 Lua/LuaJIT 的二进制文件

附带的 `lua.dll` 是基于 Lua 官网版本 5.1.4 并应用了 5.1.4-2 补丁后编译的。
附带的 `luaJIT.dll` 是基于 LuaJIT 官网版本 2.1 编译的。

- [Lua 官网](http://www.lua.org/)
- [LuaJIT 官网](https://luajit.org/)

## 许可证

::: details Lua 许可证 (MIT)
Lua is licensed under the terms of the MIT license reproduced below.
This means that Lua is free software and can be used for both academic
and commercial purposes at absolutely no cost.

For details and rationale, see http://www.lua.org/license.html .

===============================================================================

Copyright (C) 1994-2008 Lua.org, PUC-Rio.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

===============================================================================
:::

::: details LuaJIT 许可证 (MIT)
===============================================================================
LuaJIT -- a Just-In-Time Compiler for Lua. https://luajit.org/

Copyright (C) 2005-2025 Mike Pall. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

[ MIT license: https://www.opensource.org/licenses/mit-license.php ]

===============================================================================
[ LuaJIT includes code from Lua 5.1/5.2, which has this license statement: ]

Copyright (C) 1994-2012 Lua.org, PUC-Rio.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

===============================================================================
[ LuaJIT includes code from dlmalloc, which has this license statement: ]

This is a version (aka dlmalloc) of malloc/free/realloc written by
Doug Lea and released to the public domain, as explained at
https://creativecommons.org/licenses/publicdomain

===============================================================================
:::