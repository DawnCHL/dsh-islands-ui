# Changelog

## 未发布

### 兼容性

- 客户端读取 `window.__DSH_BOOT__.release.version`，按 DSH 版本选择侧栏结构样式：新增 `scroll` 变体（`src/variants/scroll.css`），适配 0.2.2-rc.2 新增的 `.kB3qhq_scrollRegion` / `.kB3qhq_scrollArea` 包装层，修复工作区列表被挤进 48px 图标栏、工作区岛只剩空白卡片的问题。旧版 DSH 不会匹配变体选择器，仍走原样式。
- 自检升级为「版本选样式 + 结构交叉验证」：版本选中的方言与挂载后的 DOM 不一致时以 DOM 为准切换变体；两者都不匹配才停用皮肤并弹出提示，避免再次静默半启用。
- `panelEntryActive` 兼容 0.2.2-rc.2 的面板选中类名（`panelActive` 已移除）。
- 设置 → Islands UI 显示检测到的 DSH 版本与侧栏结构。

### 界面

- 重写左下角桌面更新入口：隐藏原生「新版本」胶囊，改为设置齿轮上方的 36px 圆形按钮，展开与收起侧栏都可见。
- 更新状态直接订阅 `window.dshDesktop.updates`：发现新版本显示蓝色实心圆 + 下载箭头，就绪显示重启图标，失败显示半透明红底、红色描边、状态点与重试图标。
- 下载、校验、安装不再使用圆形底色，直接用皮肤强调色绘制 3×3 点阵动画（Column Flux / Smiley Spin / Core Echo），并支持 `prefers-reduced-motion` 静态回退。
- 更新入口按 DSH 版本动态读取展示数据：0.2.2-rc.2 新增的 `configurationError`（配置读取/格式/channel/清理失败）复用错误态与重试图标，旧版没有该字段时行为不变。
- 设置 → Islands UI 的「更新按钮状态」预览卡暂时隐藏；组件与样式保留，取消 `client.template.js` 中对应渲染行的注释即可恢复。

### 文档

- 新增三张 3:4 宣传图（封面、亮暗主题、三步安装），中英文 README 各加一节展示；`screenshots.json` 改为这三张，商店预览同步更新，原有的界面截图仍保留在 README 的「界面预览」中。

## 1.0.3 — 2026-11-12

### 发布

- npm 发布链路改用 npm Trusted Publishing（GitHub Actions OIDC）：发布时由 npm 用 workflow 的 OIDC 身份换取短期凭据，仓库不再保存长期 `NPM_TOKEN`。本版本无功能变更，仅用于验证 OIDC 发布链路。

## 1.0.2 — 2026-11-12

### 修复

- 修复右上角右侧栏开关点击无效：按钮原本困在 AppFrame 的 `shell.overlay` 层（z-index 20），被 `dsh-better-sidebar` 的面板宿主（铺满视口的 fixed 层，z-index 25）盖住，既不响应 hover 也没有 cursor/点击。现改为渲染到 `document.body` 并提升到 z-index 900，位于工作台图层之上、菜单与弹窗之下；同时补上皮肤关闭时的隐藏兜底。
- 右侧栏开关优先调用 `layoutService.openRightbar/closeRightbar`，服务未生效时再回退点击原生展开/收起控件。

## 1.0.1 — 2026-11-12

### 兼容性

- 启动时校验 DSH 界面锚点（`.PIRFFq_frame`、`.PIRFFq_centerCol`、`.kB3qhq_root`）。不匹配时不再"半启用"皮肤：保持 DSH 默认外观，只注册设置页，避免双栏重叠与悬浮控件遮挡。
- 不匹配时右下角弹出提示，5 秒自动关闭，可手动关闭，点击直接跳到设置 → Islands UI；设置页顶部常驻黄色说明条，列出缺失的锚点，并提供会话级「仍然启用」逃生开关。
- `shortcuts.observeFixedInput` 增加能力判断，缺失时不再中断整个 `apply()`（此前会导致设置页注册缺失）。

## 1.0.0 — 2026-11-12

首个公开发布版本。

### 界面

- 浮岛式布局：画布、主会话、工作区、右侧栏和底部面板各自成岛，统一 5px 间隙与 1px 发丝描边。
- 常驻左侧图标栏：工作区、自动化任务、插件、已固定插件与更多插件；右键或「…」打开固定菜单。
- 置顶聚合：置顶会话在「新会话」与「工作区」之间聚合展示，支持定位、取消置顶和折叠分类。
- 独立设置页：总开关、强调色预设、自定义取色与跟随主题。
- 完整深色 token；macOS、Windows 自定义顶栏和 Linux 原生窗口装饰适配。
- 快捷键沿用 DSH 绑定系统：`⌘B`、`⌥⌘B`、`⌘,`、`⌘⇧M`，按钮悬停显示当前键位。
- 窄屏（<768px）保留顶栏与常驻左侧栏，工作区改为 home 按钮打开的抽屉，恢复 5px 边距、圆角与遮罩层级；宽窄切换不再出现空白抽屉。
- 修复工作区折叠后打开右侧栏不可见的问题，按右侧面板偏好宽度设置网格轨道；resize 触发区回到画布间隙，底部面板不再裁剪拖拽条。
- 统一窄屏与 Windows 下顶栏、左侧栏、右侧栏开关的层级和标题栏偏移。

### 发布

- 包名改为 `dsh-islands-ui`，可直接通过 `dsh plugin add` 安装。
- 补齐 `dsh.bundle` / `dsh.client` / `dsh.compatibility` / `engines` 元数据，`files`、`exports`、`publishConfig` 面向 npm 发布。
- 新增 `skin.json`，供主题管理器识别皮肤 id、强调色与挂载行。
- 新增 MIT `LICENSE`、英文 README、`screenshots.json` 校验和发布前 `npm run check`。
- 新增 awesome-dsh-plugin 收录模板与 npm / DSHHub / dsh-market 发布说明。
- README 补充安装、常见问题、仓库配置、贡献与安全说明；新增英文 FAQ。
- 新增 GitHub Actions CI / Publish 工作流、Issue / PR 模板、`CONTRIBUTING.md`、`SECURITY.md`、`.editorconfig`、`.gitattributes` 和 `.nvmrc`。
- 启用 `main` 分支保护、`v*` tag 保护、外部 fork PR 审批和 Dependabot（GitHub Actions）。
