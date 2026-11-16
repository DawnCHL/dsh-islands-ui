# Changelog

## 1.2.1 — 2026-11-16

### 修复

- 置顶会话的「定位」不再误触工作区菜单：旧逻辑在工作区行内查找 `[aria-expanded]`，命中的是 hover 才显示的「⋯」菜单触发器（隐藏时矩形为 0,0），于是工作区菜单在左上角弹出、分组没有展开，会话也无法定位。现在直接点击工作区行本身展开，并按 `data-row-key` 精确匹配会话行，不再依赖标题文本。
- 定位会同时切换到该会话：先 `openSession`，再展开、滚动与高亮，侧栏选中态和对话区保持一致；即使会话行因归档或筛选不可见，也会完成切换。
- 定位支持嵌套工作区与每组默认只渲染少量会话的 overflow：按需展开祖先分组、必要时展开「显示更多」，定位结束后恢复无关分组的折叠状态。会话行由宿主 HoverCard 包裹，分组归属按 `role=group` / `role=tree` 层级判断。

## 1.2.0 — 2026-11-16

### 界面

- 新增平滑输入光标：覆盖光标与文字同高（取选区字形框高度），在同一行内以 150ms 的 `transform` 过渡平滑滑动；换行时直接跳到新行，避免斜向拖动。输入法组词期间回退到原生光标，指令 chip 选中、非折叠选区或失焦时隐藏覆盖光标。设置 → Islands UI 新增「平滑输入光标」开关，默认开启，偏好写入 `localStorage`（`dsh-islands-ui:smooth-caret`）。
- 对话输入框的光标统一由强调色 token 驱动：默认读取主题的 `--dsw-alias-state-business-primary`，自定义强调色时同步变化；平滑光标开启时由一层 2px 覆盖光标绘制，绘制期间原生光标置为透明，二者使用同一颜色。
- 发送按钮跟随强调色：原生按钮读取的是 `--dsw-alias-button-info-fill`，不会随自定义强调色变化；现改为 `--dsw-alias-state-business-primary`，并在自定义强调色时按亮/暗主题派生 hover 色。按钮通过 `composer-primary` 部件读取，不写哈希类名。

### 修复

- 窄屏（≤767px）右侧栏被工作区抽屉遮挡：右栏在窄屏由宿主切换为 `fullscreen` 覆盖层，但仍挂载在框架内的零宽右列中，抽屉遮罩（z-index 70）因此盖在它上面——抽屉一打开右侧栏就整块消失，而切换按钮仍显示“已打开”，看起来再也叫不出来。现在全屏右栏在窄屏下升到遮罩、抽屉和窗口外壳层之上（z-index 78）。
- 窄屏全屏右栏的定位偏出画布：宿主用 `right: 0` 把它挂在零宽右列上，皮肤的 5px 内边距使它左移一格、右侧留出 5px 画布。现在按画布间隙把它对齐到窗口外沿。
- 圆形控件被宿主的 `corner-shape` 规则压成圆角方形：DSH 用一条全局 `*, :before, :after { corner-shape: superellipse(1.5) }` 给所有圆角换成了 iOS 式超椭圆，`border-radius: 50%` 只决定圆角大小、不决定曲线形状，所以更新入口、开关、强调色色块、点阵圆点、滑块圆钮等看着都是"方圆"。皮肤自己的圆形控件显式声明 `corner-shape: round`（Chromium 之外该声明被忽略，退回普通圆角）。
- 更新入口的底色被对话区规则覆盖：按钮原本沿用了宿主的 `data-phase` 契约，而 `src/30-conversation.css` 里有 `body[data-islands-ui] [data-phase] { background: transparent }`（同特异性、且该文件在样式表末尾），于是未 hover 时按钮底色全透明、只剩阴影，hover 才因为规则更具体变蓝。属性改为皮肤自己的 `data-update-phase`，宿主契约规则不再命中。
- 更新入口改为跟随强调色：底色与阴影读 `--dsw-alias-state-business-primary`（皮肤把它重映射为自定义强调色），hover 色由同一 token 派生；之前是两个写死的品牌蓝，自定义强调色时不会跟随。窄屏全屏右栏改为 `position: fixed` 贴视口：宿主把它挂在右轨里用 `right: 0` 定位，右轨一旦有宽度面板就被推出屏幕，画面只剩空画布而按钮仍显示“已打开”。
- 更新入口的 `is-pending` 不再使用整体 `opacity`：那会把圆面的颜色淡化到画布色、却让彩色阴影留在原处，读起来像一枚发白的圆片浮在阴影上。改为保持饱和底色、取消上浮并收紧阴影，同时覆盖仍生效的 hover 规则（原先 hover 的特异性高于 pending）。

### 兼容性

- 平滑光标使用独立的兼容探测，与全局皮肤门禁分离：只检查 composer 的公开钩子（`[data-composer-input]`、`[data-input-scroll]`、定位包裹层）与 `data-*caret*` 外部光标标记，不再按 DSH 版本号判断。不匹配时只回退原生光标，在设置页对应开关下显示行内提示并禁用该开关，不影响皮肤其他部分；兼容后按用户原偏好自动恢复。
- 平滑光标的控制器拆成 `src/host/caret.js`，与 `src/host/runtime.js` 一样由 `build.mjs` 内联，不依赖模板内部符号；样式独立为 `src/31-caret.css`。`data-composer-input`、`data-composer-composing`、`data-composer-chip-selected`、`data-input-scroll` 登记进宿主契约表，`data-islands-smooth-caret`、`data-islands-caret-active` 登记进门禁的自身属性白名单。

## 1.1.2 — 2026-11-15

### 修复

- 设置入口不再先展开账号菜单：打开菜单后在绘制前同步点击“设置”，齿轮直达设置页。设置触发器在 rc.3 的侧栏脚注中已不存在，回退路径不再依赖固定延时。
- 设置页部件改为按作用域标记：`settings-panel` 只落在设置对话框本身，`nav`/`navTitle`/`header`/`options` 只读对话框直接子级，`close` 只在 header 内标记，导航行只在导航子树内标记。修复「内置插件」页的 tab 面板被误标成设置面板、套上 860px 宽度后被内容列裁切的问题；插件页自己的 `.panel`/`.section`/`.card` 不再获得设置页部件。
- Windows 标题栏按钮区颜色跟随皮肤 token：桌面端从 `--dsw-specific-sidebar-fill` 测量 caption 颜色，但它的 observer 只监听 body 的 `style`/`data-ds-dark-theme`。皮肤启用/停用时写入一个无副作用的行内自定义属性，触发重新测量，消除三大键区域与标题栏的色差。
- Windows 左上角原生侧栏开关改为皮肤的保宽折叠：原生 `toggleSidebar` 关闭即丢弃拖拽宽度、重新打开回到默认 280px；现在截获该按钮的点击并走 `data-islands-workspace-collapsed` 路径，宽度不再丢失。macOS / Linux 的自绘顶栏开关不变。
- 模型选择器与输入区底行对齐：`.isl-model` 改为 flex 容器，消除 inline-flex 触发器在块级 wrapper 中产生的行盒/基线空隙。

### 兼容性

- 设置页不再按通用 local class（`card`/`section`/`panel`）广播部件；这些名字在 DSH 自己的插件设置页里也会出现。第三方设置页现在保持原生几何，只继承颜色 token。
- `npm run check` 新增设置页部件作用域断言；`check:parts` 的部件表按新的对话框/导航/头部作用域标记。

## 1.1.1 — 2026-11-14

### 界面

- Windows 端不再使用自绘顶栏：工作区折叠沿用标题栏左上角的原生侧栏开关，右侧栏开关、底部面板入口等工具留在 DSH 原生的会话头位置，岛屿直接接在原生标题栏下方；macOS / Linux 保持 40px 顶栏和顶栏内的右侧工具。

### 兼容性

- 样式与 DOM 查询不再依赖 DSH 构建的哈希类名。新增 `src/host/runtime.js`：宿主契约、本地名提取、区域/部件表和遍历器；样式统一读 `data-islands-part` 与 `data-slot`、`data-phase` 等公开契约。宿主重新构建改变哈希时无需更新；宿主改本地名时对应规则安静失效，改部件表一行即可恢复。
- 删除按 DSH 版本选择的 `src/variants/scroll.css` 与版本方言表；rc.1/rc.2 的侧栏结构差异由同一张样式表按部件是否存在处理。
- 兼容门禁改为校验核心契约与核心部件；单个装饰部件缺失不再关闭整个皮肤。设置页导航改用部件查询，设置入口优先点击原生 settings 触发器。
- 新增 `npm run check:css`、`check:parts` 与 `node --test`；构建会拒绝哈希类名、`[class*=...]`、未定义部件和作用域外的宿主选择器。
- 第三方 dsh-better-sidebar 的底部工作台规则移到 `src/60-peers.css`；dsh-sidenote 的内部类名规则移除。

### 修复

- 适配 DSH 0.2.2-rc.3 新增的 `newSessionRow` 包装：新建会话行重新作为侧栏网格的第二行项，修复新建会话按钮消失、图标与左侧栏 home 图标重叠的问题。
- 注册 `islands.model.open` 时补上 `aliases: []`，修复 rc.2 Web 端快捷键参考组件读取 `row.aliases` 时的 `TypeError`。

## 1.1.0 — 2026-11-13

### 界面

- 左侧栏不再把其他插件收进「…」弹层：所有 `sidebar.panellist` 面板图标直接排列在工作区按钮下方，点击即按面板默认行为切换（`layoutService.selectPanel`）。
- 图标支持按住拖动排序，顺序写入 `localStorage`；拖动超过 4px 才进入排序，普通点击仍只切换面板。图标较多时栏内可滚动，并在拖动到上下边缘时自动滚动。进入排序后源图标变淡，同时出现一个 36px、90% 不透明度、保持抓取偏移并跟随鼠标的浮层，松手即移除。
- 右键左侧栏或任一图标打开「左侧栏图标」菜单，勾选 / 取消勾选即可增删入口；隐藏的图标仍保留在菜单中，可随时恢复。旧版 `dsh-islands-ui:rail-pins` 的固定顺序会自动迁移到新的 `dsh-islands-ui:rail` 配置。
- 菜单副标题不再把 DSH 官方客户端 bundle 的内部 fiber 名 `WC` 直接显示出来，内置项改标为「DSH 内置」；匹配时忽略大小写，第三方插件仍显示其包名。
- 左侧栏首页（工作区）图标改为纯导航触发器：不再进入 `is-active`、不再设置 `aria-pressed`、不参与拖动样式；hover 使用标准浅色反馈，点击在按钮内绘制半透明的圆形涟漪（键盘触发时从中心扩散）；全局面板图标仍按 `activePanelId` 高亮。
- 修复首页按钮在空闲状态被误标为拖动中：`dragId` 初始为 `null`，而房子的 id 也是 `null`，`dragId === id` 让房子从首帧起一直带 `is-dragging`（选中底色 + 45% 透明度）。拖动判断改为 `id !== null && dragId === id`，房子在空闲和拖动其他图标时都不再进入拖动样式。
- 移除左侧栏底部原有的「…」按钮与插件固定弹层。

## 1.0.4 — 2026-11-12

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
