# Changelog

## 1.2.6 — 2026-11-24

### 界面

- 左侧栏的归属副标题不再把无法确认的条目说成「DSH 内置」。宿主槽位账本只记录发起注册的 fiber，而内置 web client 的 `WC` fiber 同样会承接第三方插件的注册（例如 dsh-imagegen），所以 `WC` 既不代表内置也不代表第三方；现在只有拿到真实插件名时才显示归属（`· dsh-market`、`· dsh-taskboard/client`），`WC` 与空值一律不显示，内置项也不再显示归属。右键管理菜单与按钮的 `aria-label` 同步。

### 修复

- 底部 footer 在空置时真正收起。宿主给 outlet 和每个 guest 都套了 `display: contents` 锚点，插件渲染 `null` 时仍会留下空壳，原来的「存在即非空」判断把空壳当成内容，footer 永远进不了空态——`dsh-ssh` 这类常驻占位注册因此让工作区岛底部一直露着约 64px 的空条。现在穿透 `contents` 锚点，只有真实元素或可见文本才算内容；文本按节点自身统计而不是 `textContent`，隐藏子树里的文字不会被误判。
- 空置态的恢复不再漏事件。座位空置时是 `display: none`，此时 `ResizeObserver` 不回调，恢复完全依赖 `MutationObserver`；观察范围改为覆盖任意属性与文本变化，插件用 `data-*` / `aria-*` 或文本切换可见性时 footer 也能回来，不会再永久消失。
- 折叠把手与拖拽条在隐藏时真正隐藏。`body[data-islands-ui] .isl-footerHandle { display: grid }` 的优先级压过 `.isl-footerHandle[hidden]`，控制器设置的 `hidden` 不生效，空置时仍会浮着一条 20px 的把手（拖拽条同理）；隐藏规则改用相同的 `body` 前缀，空置 / 折叠时两者都不再显示。
- 首页按钮点击「工作区」会让接管中间列的插件面板（如生图工作室）回到会话：皮肤在 `selectPanel(null)` 之后派发 `dsh-panel-activate`（`detail: null`），面板据此收场，不再需要再点一次它自己的图标。

### 文档

- `docs/host-contracts.md` 的空态契约补充 `display: contents` 锚点与「可见文本」规则，并说明判定是 presence-based。

## 1.2.5 — 2026-11-19

### 界面

- 桌面更新入口从 36px 收到 30px，并按新尺寸重新居中：圆心与设置齿轮同列（`left` 用 30px 重算），与齿轮间距保持 8px。
- 下载不再用 3×3 点阵动画，改成贴着实心圆边的进度环：宿主 `dshDesktop.updates` 在 `downloading` 阶段会给出 `percent`，环用 `pathLength="100"` 的 `stroke-dasharray` 直接按百分比填充，0.3s 过渡吃掉上报跳变；百分比只进 `title`/`aria-label`，圆内不塞数字。
- `verifying` / `installing` 没有百分比，用同一圆环的不确定态区分：校验匀速绕圈（1.6s），安装加快到 0.9s 并叠加透明度呼吸；`prefers-reduced-motion` 下停掉动效，保留四分之一圆弧。
- 宿主没有给出 `percent` 时（理论上不会发生）退回「正在下载更新」文案 + 不确定环，不再显示 0%。
- 下载态内部不再放下载图标，圆环就是全部状态；失败态改用下载图标（点击即重试下载），安装/就绪仍是重启箭头。
- 更新入口去掉投影（常态 / hover / 点击守卫 / 失败态），只留圆面、边框与状态点；hover 仍保留 1px 上浮与加深底色。
- 旧的 `DotMatrixGlyph` 与三套 `isl-dmx-*` 动画、`corner-shape` 白名单里的残留选择器一并删除；设置页不再提供按钮状态预览（展示卡组件、文案与样式整体移除，状态只由轨道上的真实入口体现）。
- 左侧栏图标悬停后在右侧浮出名称气泡：深底白字胶囊，垂直居中对齐图标，与图标相距 8px；悬停 340ms 出现，直接在图标之间移动时立即切换，键盘 `Tab` 聚焦立即显示；离开、点击、开始拖拽、右键菜单、失焦都会立即收起。
- 气泡用 `body` portal + `position: fixed`（z-index 1200）绘制：轨道是 `overflow-x: hidden` 的滚动容器，气泡挂在按钮里会被裁掉；轨道滚动或窗口缩放时按所属图标实时重算坐标并跟随，只有图标离开文档才消失（对话流式滚动不会误收气泡）。
- 亮 / 暗两套配色来自新令牌 `--isl-tooltip-bg` / `-fg` / `-ring` / `-shadow`：亮色是反相近黑胶囊；暗色用比轨道高一层的炭灰 + 1px 浅色描边 + 更深投影；`prefers-reduced-motion` 下去掉入场动画。
- 左侧栏按钮与设置齿轮去掉原生 `title`，不再和皮肤气泡叠出两个提示；无障碍名称仍由 `aria-label` 提供，气泡本身 `aria-hidden`。
- 气泡只显示目标名（如「插件」），归属信息（`· DSH 内置` / `· dsh-market`）继续留在 `aria-label` 与右键管理菜单里。

### 修复

- 底部 footer 在内容很短时不再保留 200px 的最小高度：座位改为贴合自然内容（20px 顶部 handle 留白 + 内容 + 8px 底部内距），工作区不会再被大块空白挤压。拖拽下限同步改为 `min(200px, 内容自然高度)`，短内容也能拖回自身高度；旧版本写入 `localStorage` 的 200px 拖拽下限值（无法与“未拖拽”区分）升级后一次性迁移为自适应，版本化后的 200px 拖拽高度仍会保留。
- footer 改为不可换行的纵向堆叠：此前宿主的 `flex-wrap: wrap` 会在内容纵向放不下时把新访客排成第二列，把原有按钮横向挤出岛屿；现在固定为 `nowrap`，横向溢出由座位裁掉，直接访客宽度上限为座位内容宽度。存储高度在“内容不超过 200px 且存储值等于内容下限”时按自适应处理（避免 0.4px 取整差）；内容高于下限时，拖到下限会保持固定的 200px 下限并在内部滚动，不会再弹回完整内容高度。
- footer 座位按左侧 rail 的方式隐藏滚动条（`scrollbar-width: none` + `::-webkit-scrollbar`），不再有 5px 滚动条占用宽度。内容只比固定高度多 16px 以内时按内容高度渲染，避免为按钮/行的 6px 缝隙显示滚动条；更大的溢出仍可用滚轮/触控板滚动。
- 兼容门禁不再把「冷启动慢」当成「宿主改版」。原来只要 `#root` 里出现任意子节点（启动骨架就算），1.2s 后锚点不齐就判定失败且不再重试；冷启动时启动骨架比外壳早约 3 秒出现，皮肤会一直停用，只能手动点「仍然启用」。现在先等 `[data-slot="root"]`（最多 10s），外壳挂载后再给 `data-islands-part` 1.5s 提交时间，只有「外壳已挂、part 始终不来」才按改版处理。
- 门禁失败后仍会观察 60s：锚点晚到就自动重新启用皮肤，并撤掉已弹出的兼容提示；提示本身延后 1.5s，慢启动不再闪一下。
- 门禁改用 `setTimeout`（100ms）轮询替代 `requestAnimationFrame`：窗口被遮挡或最小化时 rAF 会被节流到停摆，门禁会卡在等待状态。
- 所有截止时间只计「可见时间」：页面隐藏时时钟冻结，回到可见立即重判；隐藏期间到期的兼容提示推迟到可见时再弹，并只在可见时开始 5s 自动消失计时。提示的入场也不再依赖 `requestAnimationFrame`（改为强制回流 + 立即加类），隐藏窗口不会出现「创建了但从未显示、5 秒后被删」。
- 门禁从模板抽成 `src/host/compat-gate.js`：时钟、定时器、可见性、契约探针与回调全部注入，模板只负责接线；`forced` 由 `isForced()` 发布，自愈不会抹掉「已强制启用」文案。
- 新增 `test/compat-gate.test.mjs`：直接 import 模块，用可控时钟 + 假页面 + 轮询断言覆盖慢启动、超时失败、部件缺失、提示延后、自愈撤提示、隐藏冻结/延迟提示、`stop()` 解绑与接线回归。
- 运行时让位，处理与其它插件争抢侧栏导致的往复（#12）。判据是「3 秒内宿主的 `data-sidebar-collapsed` 出现 3 次」：皮肤只会删除这个属性、从不让它出现，所以每一次出现都来自别人，不需要额外排除自身。达到阈值的那一次不再执行展开，直接让步，因此用户最多看到两次工作区翻转。
- 实测 DSH 0.2.2-rc.5 + ds-bot 0.3.8 的 Bot 模式：修复前每秒一次无限往复；修复后两次翻转即停止，皮肤把侧栏让给对方，此后稳定停在 `0px`，不再闪。
- 让位本身不弹全局提示，只写一条 `console.info`；状态、原因、时间与「立即重试」在设置页「Islands UI」分区里，用户自己的启用开关不受影响，也不会被改写。
- 自动恢复要等侧栏稳定展开（不是「没有新事件」），侧栏仍收起时绝不试探；等待按 500ms → 1s → 1.5s 逐次拉长，取实测「对方每次在我们展开后 240–280ms 就重新收起」的 2–6 倍余量，切回 Agent 模式后约 0.5 秒就能回来。
- 连续三次恢复失败说明是持续冲突而不是抢跑，改为每 30 秒试探一次，并在右下角弹出提示：关闭皮肤 / 立即重试 / 取消（取消只收提示，不动皮肤，也不改启用开关）；侧栏仍收起时「立即重试」会被拒绝、提示保留，不会变成点了没反应；同一次僵持只提示一次，真正恢复成功后重新计数。
- 判据与计时从模板抽成 `src/host/yield.js`，时钟、定时器、折叠探针、提示回调全部注入，与 `collapse.js`、`compat-gate.js` 同一套拆分；新增 `test/yield-guard.test.mjs`，覆盖阈值、窗口淘汰、等待梯度与放慢、提示只发一次、恢复后重新计数、隐藏页面、手动重试与 `stop()`。
- Windows 标题栏按钮的点击拦截在让位期间自然失效（它本来就读 `body[data-islands-ui]`），不会出现「点了没反应」。
- 修复在设置页关闭皮肤后，皮肤节点仍留在页面上并显示为默认排版（左上角一排方形按钮、输入框上方的模型芯片、底部的白色条）。原因是这些根节点只在 `body[data-islands-ui]` 作用域内声明了 `display`，属性移除后回落到默认排版；运行时关闭与冷启动降级不同，组件不会卸载。左侧栏、轨道按钮、模型选择器、页脚折叠手柄与拖拽条、固定会话区补上作用域外的 `display: none` 基线规则，与顶栏、右栏按钮的既有写法一致。实测关闭后页面上可见的皮肤节点为 0；重新开启后各节点位置不变（顶栏 0,0 1196×40、轨道 5,50 48×169、模型芯片 824,881、页脚手柄 66,750 211×20）。
- `scripts/check-css.mjs` 的说明改为：组件在运行中关闭皮肤后仍然挂载，因此皮肤根节点必须在作用域外默认隐藏；`docs/host-contracts.md` 新增「皮肤关闭时」一节记录这条约束。
- 让位提示加「不再提示」勾选：只写内存标志，不落 localStorage，刷新页面或退出 DSH 后恢复提示；勾选后同一次会话内不再弹出，探测与自动恢复不受影响。
- 让位提示 8 秒后自动关闭，关闭方式与「取消」一致（不关闭皮肤、不改任何状态）。剩余时间画成弹窗顶部边缘的 2px 进度条，随圆角裁切、从右往左排空，不显示数字；排空由 CSS `transform` 关键帧驱动（合成器执行），不再用 100ms 定时器逐格改样式，实测 900ms 内 55 帧、每帧数值都不同，主线程忙碌也不会顿。计时只算可见时间，窗口被遮挡或最小化时冻结，回到可见继续；实测可见窗口下倒计时约 8.0 秒（节点在 8.4 秒时移除，含 200ms 淡出），进度条 3 秒时剩 62%。
- 提示文案改为「Islands UI 主题没有生效 / 可能是其他插件影响，没有主题生效的条件，你可以关闭主题，或者立即再试一次。」，英文同步。
- 让位提示改用主题强调色：左边框、顶部进度条、主按钮与「不再提示」的勾选框都读 `--isl-accent`（拿不到时回落默认蓝），暗色主题下进度条按同色相提亮。强调色是写在 `body` 内联的变量，皮肤关闭时同样可用，所以提示不会退回硬编码的蓝色。

### 兼容性

- 新增 `test/rail-tooltip.test.mjs`：锁定图标无原生 `title`、portal 结构、定位公式、滚动 / 缩放跟随以及亮暗两套令牌。

## 1.2.4 — 2026-11-18

### 界面

- 折叠模型：宿主永远保持展开（`wide=true`），`data-islands-workspace-collapsed` 是唯一折叠状态；皮肤隐藏工作区列并把帧首列缩到 `--isl-rail-collapsed-width`（= `--isl-rail-width`，48px）。插件不会再收到 `wide=false`，也不会出现宿主 compact footer 把多个入口并排塞进 36px 轨道被裁的问题。
- 展开态 settings 座位是 48px 轨道列：账号 36px 头像 tile；插件加到设置行里的入口统一折成 36px tile（`max-width:36px`、`flex-wrap:wrap`、`order:-1` 在账号上方）；图标访客的叶标签进入无障碍树；替换式 launcher 只保留头像。
- 宿主原生折叠（macOS 主 `⌘B` / Windows 标题栏按钮）由 `native collapse conversion` 转换回皮肤折叠；新增 `src/host/collapse.js` 的 `hostCollapseAction()`：皮肤关闭不接管、drawer 清状态、`<1024`/跨断点 resize/窄窗右栏等自动折叠只折叠不 toggle，只有宽窗下的用户手势才 toggle。
- 关闭皮肤时清掉皮肤折叠与 `data-islands-animating`，宿主恢复原生折叠。
- 折叠帧首列改用 `--isl-rail-collapsed-width: var(--isl-rail-width)`；工作区 DOM 保持挂载，皮肤折叠路径下滚动位置与侧栏宽度保留（原生 `⌘B` 仍按宿主默认回 280）。
- 折叠时焦点在工作区列内会移到 topbar toggle / 轨道首页；topbar toggle 补 `aria-expanded` 与折叠/展开文案。
- 轨道图标在折叠态选中即展开工作区。
- 修正文档：不再声称删除从未引入的 `src/host/rail.js`；`sidebar-collapsed` 样式仅用于 conversion 瞬态；去掉重复的 1.2.3 标题。

## 1.2.3 — 2026-11-17

### 界面

- `sidebar.footer.action` 从 48px 轨道挪到工作区岛底部：工作区列里工作区占 3–4 行、footer 独占第 5 行（`foot-area` 展开态 `display: contents`，`settings-area` 仍留轨道底部）。宽栏插件（如 dsh-cost-meter）不再被塞进窄轨道，`wide` 契约与座位宽度重新一致。
- footer 容器由皮肤负责：默认自适应内容、`max-height: min(320px, 侧栏高 45%)`、拖动接缝调整高度并写入 `localStorage`、底部 handle 折叠/展开、内容超出时内部滚动；空态自动隐藏。默认展开，折叠状态和高度在下次打开窗口时恢复。
- 展开态的 36px tile 归一化移除，仅保留在 `sidebar-collapsed` 轨道。
- 修复重启后 `sidebar.footer.action` 消失：footer 空态改为按槽位子项是否存在判断。插件异步挂载时，座位可能已经被空态 `display: none`，旧实现的“量高度”判断会一直读到 0，导致 footer 永远不再出现。
- footer 细节：去掉 `footer-actions` 的 `border-top`，用 20px 顶部留白做分隔；handle 是覆盖整行留白的白底遮罩条（去掉 `box-shadow`），hover/拖动时整行圆角高亮，滚动内容不会从按钮两侧露出；工作区折叠时 footer 与 handle 一起隐藏。
- 修复折叠后 cost-meter 线框残留：宿主 `[data-slot]` 包装层带内联 `display: contents`，折叠规则需要 `!important` 才能盖过它。
- resize 改为 handle 上方 5px 的独立拖动条，handle 按钮本身只负责折叠/展开，两者热区不重叠；拖动条悬停/拖动时用强调色 3px 细条高亮触发区。
- handle 的 hover 高亮改为 `opacity` 0.25s 淡入淡出，出现/消失不再突兀；`prefers-reduced-motion` 下禁用过渡。
- handle 的 `aria-label` 跟随 `documentElement.lang`（zh / en），并加 `aria-controls` 指向 footer 容器；新增 footer 高度 `clamp` / `max` 的纯函数行为测试，tile 断言锁定 `sidebar-collapsed` 作用域。
- `sidebar.footer.action` 最小高度 200px（拖动/记忆高度下限也是 200px）；handle 移除 `title` 原生提示，保留 `aria-label`。
- 评审修复：窄屏抽屉下 handle/resize 升到 `z-index: 72`，并监听 `data-sidebar-drawer` / `transitionend` 重新定位；`min-height` 改为 `min(200px, max-height)`，矮窗口不再压过 45% 上限；`settings-area` 改为 flex 居中；`hasContent` 增加无 `[data-slot]` 外壳 fallback 并忽略插件 `display:none` 的占位；文档同步。
- 折叠态 20px handle 作为岛屿底盖：水平保持与展开相同的 8px 内缩（宽度不再 211→225 跳变），仅垂直内缩 1px 让卡片底边框可见，底部圆角用内圆角；窄屏抽屉下 footer 上移 `--isl-gap`。绝对上限从 320px 提到 800px（45% 相对上限不变）。
- 去掉 `footer-actions` 的 `scrollbar-gutter: stable`：它只在右侧预留滚动条槽，导致左右都是 8px padding 但视觉偏左；现在交给系统 overlay 滚动条。

### 兼容性

- 新增 `src/host/footer.js` 控制器（`build.mjs` 内联）；`src/host/foot.js` 改为测量 `settings-area`（`foot-area` 在展开态是 `display: contents`，不再有盒子）。
- `npm run check` 增加 `check:syntax`：`client.js` 内联多个 host 模块，顶层标识符重名会让整个插件不加载（设置页也不会出现）；现在构建后先做语法门禁。
- `docs/host-contracts.md` 更新座位契约与访客契约；`test/foot-anchors.test.mjs` 增加工作区底部座位、控制器和折叠轨道归一化的断言。

## 1.2.2 — 2026-11-16

### 修复

- 窄栏下 `sidebar.footer.action` 的宽栏插件按钮撑出 48px 轨道：皮肤按宿主的 slot 锚点（`[data-slot="sidebar.footer.action"]`，`display: contents`）把直接访客控件归一化为 36px 方块，文字标签移入可访问树（插件自己的 `title`/`aria-label` 保留），并补齐 hover、`focus-visible`、`aria-pressed`/`aria-expanded` 状态。只作用于槽位的直接访客，插件组件内部的按钮不受影响。
- 账号行旁的访客入口（移动插件那类）与 36px 账号并排时溢出轨道：行改为纵向排列，访客收成 36px tile 放在账号上方。
- 轨道脚注的齿轮、更新入口和列表预留不再假设「底部只有账号」：新增 `src/host/foot.js` 实测 `foot-area` 高度并发布 `--isl-foot-height`，三处锚点从它派生；脚注被宿主隐藏时回退到旧几何。1 个、2 个或更多插件按钮都成立。
- 脚注测量只观察 `data-islands-part` 属性，流式会话 DOM 不再进入观察路径。

### 兼容性

- 访客归一化只读宿主契约 `[data-slot="sidebar.footer.action"]`、`settings-trigger-row` 部件和通用元素/ARIA 角色，不含插件包名、类名前缀或专属属性；`docs/host-contracts.md` 记录了共享槽位所有权与访客契约。
- 未展开控件的 `overflow: clip` 保留；`aria-expanded='true'` 的控件改为 `overflow: visible`，插件在控件内部渲染的弹出层不被裁切。

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
