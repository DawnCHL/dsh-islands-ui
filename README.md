<div align="center">
  <img src="icon.svg" width="76" height="76" alt="Islands UI" />
  <h1>Islands UI</h1>
  <p><strong>为 DeepSeek Harness 打造的浮岛式界面皮肤</strong></p>
  <p>圆角岛屿 · 常驻左侧栏 · 置顶聚合 · 可调强调色</p>
  <p>
    <img alt="DSH" src="https://img.shields.io/badge/DeepSeek%20Harness-0.2.2--rc.1-4f7cff?style=flat-square" />
    <img alt="Platform" src="https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-3b3b3b?style=flat-square" />
    <img alt="Windows/Linux" src="https://img.shields.io/badge/Windows%2FLinux-untested-orange?style=flat-square" />
  </p>
</div>

<p align="center">
  <img src="assets/all-panels.png" alt="Islands UI 主界面：左侧栏、会话区、右侧栏与底部面板" width="100%" />
</p>

Islands UI 把 Harness 的三栏界面重新组织成一组悬浮在纯色画布上的圆角岛屿：左侧常驻图标栏、独立的工作区列表、主会话区、右侧工作台和底部面板各自成块，用 5px 的画布间隙与发丝描边分层。它不修改 Harness 的会话、设置或插件逻辑，只重绘界面。

---

## 界面预览

| 新会话 | 工作区折叠 |
| :---: | :---: |
| ![新会话](assets/new_session.png) | ![工作区折叠](assets/workspace-closed.png) |
| **置顶与定位** | **设置 · Islands UI** |
| ![置顶与定位](assets/pin-session.png) | ![设置](assets/settings.png) |

---

## 功能

| | 功能 | 说明 |
| :---: | --- | --- |
| 🏝 | **浮岛布局** | 画布、主会话、工作区、右侧栏、底部面板各自独立；扁平无投影，以色块 + 1px 发丝线分隔 |
| 🧭 | **常驻左侧栏** | 工作区 / 自动化任务 / 插件 / 已固定插件 / 更多；右键或「…」打开插件固定菜单 |
| ⚙️ | **独立设置页** | 设置 → Islands UI：一键开关皮肤、强调色（预设 + 自定义 + 跟随主题） |
| 📌 | **置顶聚合** | 置顶会话同时保留在原工作区，并聚合到「新会话」与「工作区」标题之间；分类可折叠 |
| 🎯 | **定位置顶项** | 悬停置顶项出现「取消置顶 + 定位」两个按钮；定位会折叠其他工作区、展开所属工作区并滚动聚焦目标会话 |
| 🎛 | **模型/推理弹层** | 输入框内两级弹层：第一级推理等级，第二级模型；换模型自动回落默认档 |
| 🌙 | **深色模式** | 完整深色 token：近黑画布、深灰岛屿、白色透明交互层与深色阴影 |
| ⌨️ | **快捷键** | `⌘B` 折叠工作区、`⌥⌘B` 右侧栏、`⌘,` 设置、`⌘⇧M` 模型弹层；按钮悬停显示当前键位 |

### 设计语言

| 层级 | 规则 |
| --- | --- |
| 画布 | 纯色 `#f7f7f7`（深色 `#0f1012`），不透明、无毛玻璃 |
| 岛屿 | 白色 / 深灰表面，16–20px 圆角，1px 发丝描边，无投影 |
| 间距 | 所有岛屿统一 5px 间隙，左右、顶部、底部、底部面板四周一致 |
| 顶部栏 | 40px 窗口栏，承载工作区折叠、对话工具组和右侧栏开关；macOS 避开红绿灯，Windows/Linux 从 8px 开始 |
| 强调色 | 默认品牌蓝，可改为紫 / 绿 / 橙 / 粉 / 红或任意取色 |

### 常用快捷键

| 快捷键 | 功能 |
| --- | --- |
| `⌘B` / `Ctrl+B` | 折叠 / 展开工作区 |
| `⌥⌘B` / `Ctrl+Alt+B` | 打开 / 关闭右侧栏 |
| `⌘,` / `Ctrl+,` | 打开设置 |
| `⌘⇧M` / `Ctrl+Shift+M` | 打开模型 / 推理弹层 |
| `⌘N` / `Ctrl+N` | 新会话 |
| `⌘K` / `Ctrl+K` | 搜索会话 |
| `⌘/` / `Ctrl+/` | 快捷键向导 |

> 快捷键沿用 Harness 的绑定系统，可在「设置 → 快捷键」里重新绑定；悬停对应按钮会显示当前键位。

---

## 平台支持

| 平台 | 状态 |
| --- | --- |
| macOS | ✅ 已实测（开发与日常使用环境） |
| Windows | 🟡 已适配自定义顶栏、左侧栏、设置齿轮、右侧开关、置顶聚合与模型弹层，并在原生标题栏下方预留高度；**尚未在真实 Windows 电脑上实测** |
| Linux | 🟡 使用同一套顶栏与左侧栏；**尚未实测** |

Windows 下保留 Harness 原生标题栏，自定义顶栏显示在它下方；左侧栏、设置齿轮、右侧栏开关和快捷键均已启用。Linux 按原生窗口装饰处理，不同桌面环境可能有差异。

> **反馈**：如果你在 Windows 或 Linux 上遇到标题栏高度、拖拽区域、窗口按钮重叠、布局错位或快捷键问题，欢迎提交 [Issue](https://github.com/DawnCHL/dsh-islands-ui/issues) 或 PR，附系统版本、窗口尺寸和截图即可。

---

## 安装

> 这是一个**本地 Harness bundle**，尚未发布到 npm；当前按 DSH `0.2.2-rc.1` 的客户端接口与 DOM 构建。

1. 克隆仓库：

   ```bash
   git clone git@github.com:DawnCHL/dsh-islands-ui.git
   ```

2. 在 DSH 的插件管理器中把该目录作为本地 bundle 安装，或手动 link 到 profile 后合并本仓库的 `cordis.patch.yml`：

   ```yaml
   - insert:
       - id: islands-ui
         name: '@local/dsh-islands-ui'
   ```

3. 刷新页面（`⌘R` / `Ctrl+R`）。皮肤默认开启；可随时在 **设置 → Islands UI** 关闭，关闭后立即恢复 Harness 默认外观。

### 状态存储

| `localStorage` key | 作用 |
| --- | --- |
| `dsh-islands-ui:enabled` | `1` / `0`，总开关 |
| `dsh-islands-ui:accent` | 自定义强调色（不存在表示跟随主题） |
| `dsh-islands-ui:pinned-collapsed` | 置顶分类是否折叠 |
| `dsh-islands-ui:rail-pins` | 左侧栏额外固定的插件 id 列表 |

清除这些 key 即可恢复默认。

---

## 开发

```text
src/
  00-tokens.css        设计变量 + 重定向 Harness 的 --dsw-* 别名（唯一真源）
  10-shell.css         三栏框架 → 画布 + 岛屿
  15-topbar.css        窗口顶部栏
  16-rail.css          左侧图标栏、插件固定菜单、设置齿轮
  20-sidebar.css       工作区岛屿、置顶聚合、会话行状态
  30-conversation.css  会话页、输入框、顶部工具组
  40-settings.css      设置弹窗、设置页外壳
  45-model-picker.css  模型/推理两级弹层
  50-components.css    偏好行、开关、强调色选择器等共享组件
  client.template.js   浏览器端入口模板（React 组件 + 插槽注册）
build.mjs              把 src/*.css 内联进 client.js
client.js              构建产物（自包含，运行时无法读文件）
```

```bash
node build.mjs   # 修改 src/*.css 或模板后重新生成 client.js
```

开发时直接在 Harness 中刷新（`⌘R`）即可；`client.js` 是自包含的浏览器模块，样式在加载时注入。

---

## 兼容性与边界

- 皮肤是**纯客户端样式层**，不替换会话、设置或插件的数据与交互；左侧栏插件固定、置顶聚合、定位等额外能力也只在客户端完成。
- 选择器依赖 Harness 当前构建的 CSS Module 哈希类名（如 `PIRFFq_*`、`kB3qhq_*`、`JoiKIa_*`、`_77Pn0W_*`）与少量 `data-*` 挂点；**Harness 升级或重新构建后类名可能变化，需要同步更新对应 CSS**。
- 深色模式跟随 Harness 的 `data-ds-dark-theme`；强调色通过重映射 `--dsw-alias-state-business-primary` 生效，会同时影响皮肤和原生按钮。
- Windows 使用 `data-windows-titlebar` 与 `--dsh-windows-titlebar-height` 适配原生标题栏；Linux 暂无专用标题栏变量，按原生窗口装饰处理。

---

## 反馈

- Bug / 兼容性问题：[Issues](https://github.com/DawnCHL/dsh-islands-ui/issues)
- 改进或新功能：欢迎直接开 PR
- 特别欢迎 Windows / Linux 的实测反馈（截图 + 系统版本 + 窗口尺寸）

<p align="center"><sub>Made for DeepSeek Harness · Islands UI</sub></p>
