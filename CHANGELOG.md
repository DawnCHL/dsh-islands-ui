# Changelog

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
